const express = require("express");
const queryAsync = require("../utils/db");
const router = express.Router();

exports.booking = async (req, res) => {
  console.log("booking hit");
  try {
    const { carId, pickDate, returnDate, sumPrice, bookDate, userId } =
      req.body;
    console.log(carId, pickDate, returnDate, sumPrice, bookDate, userId);

    if (!pickDate || !returnDate) {
      return res
        .status(400)
        .json({ message: "Tanggal pemesanan tidak boleh kosong" });
    }

    const checkStatus = await queryAsync(
      "SELECT * FROM kendaraan WHERE ID_KENDARAAN = :carId",
      { carId }
    );
    console.log(checkStatus[0].STATUS);
    console.log(checkStatus.STATUS);

    console.log("checkStatus", checkStatus);
    if (checkStatus.length === 0) {
      return res.status(404).json({ message: "Kendaraan tidak ditemukan" });
      console.log("kendaraan tidak ditemukan");
    } else if (checkStatus[0].STATUS !== "Tersedia") {
      console.log("kendaraan tidak tersedia");
      return res
        .status(400)
        .json({ message: "Kendaraan tidak tersedia untuk pemesanan" });
    }

    const bookingResult = await queryAsync(
      `INSERT INTO pemesanan
      ( tanggal_pemesanan, tanggal_mulai_sewa, tanggal_akhir_sewa, total, status_pemesanan, pelanggan_id_pelanggan, kendaraan_id_kendaraan) 
      VALUES (
        TO_DATE(:bookDate, 'YYYY-MM-DD'),
        TO_DATE(:pickDate, 'YYYY-MM-DD'),
        TO_DATE(:returnDate, 'YYYY-MM-DD'), 
        :sumPrice, 
        'menunggu konfirmasi', 
        :userId, 
        :carId)`,
      {
        bookDate,
        pickDate,
        returnDate,
        sumPrice,
        userId,
        carId,
      }
    );

    // if (bookingResult.rowsAffected === 0) {
    //   return res
    //     .status(500)
    //     .json({ message: "Gagal membuat pemesanan, silakan coba lagi" });
    // }

    const updateStatus = await queryAsync(
      "UPDATE kendaraan SET status = 'Tidak tersedia' WHERE ID_KENDARAAN = :carId",
      { carId }
    );

    // if (updateStatus.rowsAffected === 0) {
    //   return res
    //     .status(500)
    //     .json({ message: "Gagal memperbarui status kendaraan" });
    // }

    res.status(201).json({
      message: "Pemesanan berhasil dibuat, menunggu konfirmasi",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan saat membuat pemesanan",
      error: error.message,
    });
  }
};
