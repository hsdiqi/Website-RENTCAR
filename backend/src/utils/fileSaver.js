const fs = require("fs");
const path = require("path");

/**
 * Menyimpan file ke sistem berkas
 * @param {Buffer} buffer -buffer dari multer
 * @param {string} originalname - nama asli file yang akan disimpan
 * @param {string} destination - direktori tujuan untuk menyimpan file
 * @returns {string} imagePath (path relatif ke file yang disimpan ke db)
 */

function saveImageBuffer(buffer, originalname, destination) {
  const filename = originalname;
  const filePath = path.join(destination, filename);
  const fullPath = path.join("public", filePath);

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, buffer);

  return "/" + filePath.replace(/\\/g, "/");
}

module.exports = {
  saveImageBuffer,
};
