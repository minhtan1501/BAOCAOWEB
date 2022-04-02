const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const fs = require("fs");
// upload img on cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Upload image

router.post("/upload",auth,authAdmin, (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded" });
    }
    const file = req.files[""];
    // file > 1mb
    if (file.size > 1024 * 1024)
    { 
        removeFile(file.tempFilePath)
        return res.status(400).json({ msg: "Size too large" });

    }

    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
        removeTMP(file.tempFilePath)
        return res.status(400).json({ message: "File format is incorrect" });
    }
    cloudinary.uploader.upload(
      file.tempFilePath,
      { folder: "baocao" },
      async (err, result) => {
        if (err) throw err;
        removeTMP(file.tempFilePath)
        res.json({public_id:result.public_id,url:result.secure_url});
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
router.post('/destroy',auth,authAdmin,(req, res) => {
    try {
        const {public_id} = req.body;
        console.log(public_id);
        if(!public_id) return res.status(400).json({msg: 'No image selected'});

        cloudinary.uploader.destroy(public_id,async(err, result)=>{
            if(err) throw err;
            res.status(200).json({ message: 'Delete image successfully!'});
        })

    }
    catch(err) {
        return res.status(500).json({message:err.message});
    }
})

const removeTMP = path =>{
    fs.unlink(path,err=>{
        if(err) throw err;
    })
}

module.exports = router;
