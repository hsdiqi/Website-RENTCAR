const oracledb = require("oracledb");
const queryAsync = require("../utils/db");
const { saveImageBuffer } = require("../utils/fileSaver");

exports.addCar = async (req, res) => {
  try {
    const {
      nameCar,
      tipe,
      color,
      capacity,
      nopol,
      thnBeli,
      service,
      speed,
      harga,
    } = req.body;

    const image = req.file;

    const requiredFields = [
      nameCar,
      tipe,
      color,
      capacity,
      nopol,
      thnBeli,
      service,
      speed,
      harga,
      image,
    ];

    if (requiredFields.includes(undefined)) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    const status = "tersedia";
    const imageName = image.originalname;


    const idResult = await queryAsync(
      `SELECT * FROM katalog_kendaraan WHERE TRIM(UPPER(tipe_kategori)) = TRIM(UPPER(:tipe))`,
      { tipe }
    );

    console.log("ID Result:", idResult);

    if (!idResult || idResult === 0) {
      return res.status(404).json({
        message: "Tipe kategori tidak ditemukan dalam database.",
        detail: `Tipe: ${tipe}, result: ${idResult}`,
      });
    }

    const idKategori = idResult[0].ID_KATEGORI;
    const uniqueName = `${Date.now()}-${imageName}`;

    const result = await queryAsync(
      `INSERT INTO kendaraan 
        (nama_kendaraan, nopol, tipe_kendaraan, harga, status, katalog_kendaraan_id_kategori, foto_kendaraan, top_speed, last_service, cap_penumpang, warna, tahun_beli, banyak_sewa) 
        VALUES 
        (:nameCar, :nopol, :tipe, :harga, :status, :idKategori, :foto, :speed, TO_DATE(:service, 'YYYY-MM-DD'), :capacity, :color, :thnBeli, 0)`,
      {
        nameCar,
        nopol,
        tipe,
        harga: parseFloat(harga),
        status,
        idKategori,
        foto: uniqueName,
        speed: parseFloat(speed),
        service,
        capacity: parseInt(capacity, 10),
        color,
        thnBeli: parseInt(thnBeli, 10),
      }
    );

    console.log("Insert result:", result);

    const imagePath = saveImageBuffer(image.buffer, uniqueName, "/uploads/images/cars");
    console.log("Image saved at:", imagePath);
    console.log("unique name:", uniqueName);

    res.status(201).json({
      message: "Kendaraan berhasil ditambahkan",
      data: {
        // id_kendaraan: result.outBinds.id_kendaraan[0],
        nama_kendaraan: nameCar,
        nopol,
        tipe,
        harga,
        status,
        idKategori,
        foto: imagePath,
        speed,
        service,
        capacity,
        color,
        thnBeli,
        banyak_sewa: 0,

      },
    });
  } catch (err) {
    console.error("Error adding car:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
