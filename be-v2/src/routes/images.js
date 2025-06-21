const express = require("express");
const path = require("path");
const router = express.Router();

const imagePath = path.join(__dirname, "../../public/uploads/images");
const imagePathCars = path.join(__dirname, "../../public/uploads/images/cars");
const imagePathKaryawan = path.join(__dirname, "../../public/uploads/images/karyawan");
const imagePathPelanggan = path.join(__dirname, "../../public/uploads/images/pelanggan");

// const isValidFilename = (filename) => /^[\w,\s-]+\.[A-Za-z]{3,10}$/.test(filename);

// Helper untuk mengirim file
const sendFileHandler = (folderPath) => (req, res) => {
  const filename = req.params.filename;
  // console.log("Requested filename:", filename);
  
  // if (!isValidFilename(filename)) {
  //   return res.status(400).send("Invalid filename");
  // }

  const filePath = path.join(folderPath, filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send("File not found");
    }
  });
};

// router.get("/", sendFileHandler(imagePath));
// router.get("/:filename", sendFileHandler(imagePath));
router.get("/cars/:filename", sendFileHandler(imagePathCars));
router.get("/karyawan/:filename", sendFileHandler(imagePathKaryawan));
router.get("/pelanggan/:filename", sendFileHandler(imagePathPelanggan));

module.exports = router;