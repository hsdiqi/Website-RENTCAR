const multer = require("multer");
const path = require("path");
const fs = require("fs");

// const createUploader = (getDestinationCallBack) => {
//     const storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//             const folder = getDestinationCallBack(req, file);

//             fs.mkdirSync(folder, { recursive: true });
//             cb(null, folder);
//         },
//         filename: function (req, file, cb) {
//             const uniqueName = Date.now() + "-" + file.originalname;
//             cb(null, uniqueName);
//         }
//     });

//     return multer ({storage})
// }

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;