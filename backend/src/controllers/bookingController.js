const express = require("express");
const queryAsync = require("../utils/db");
const router = express.Router();

exports.booking = async (req, res) => {
  try {
    const { carId } = req.params;
    const { pickDate, returnDate, sumPrice, bookDate, userId } = req.body;

    if (!pickDate || !returnDate) {
      return res
        .status(400)
        .json({ message: "Tanggal pemesanan tidak boleh kosong" });
    }

    const checkStatus = await queryAsync(
      "SELECT * FROM kendaraan WHERE ID_KENDARAAN = :carId",
      { carId }
    );
    if (checkStatus.rows.length === 0) {
      return res.status(404).json({ message: "Kendaraan tidak ditemukan" });
    } else if (checkStatus.rows[0].status !== "tersedia") {
      return res
        .status(400)
        .json({ message: "Kendaraan tidak tersedia untuk pemesanan" });
    }

    const bookingResult = queryAsync(
      `INSERT INTO pemesanan
      ( tanggal_pemesanan, tanggal_mulai_sewa, tanggal_akhir_sewa, total, status_pemesanan, pelanggan_id_pelanggan, kendaraan_id_kendaraan) 
      VALUES (:bookDate, :pickDate, :returnDate, :sumPrice, 'menunggu konfirmasi', :userId, :carId)`,
      {
        bookDate,
        pickDate,
        returnDate,
        sumPrice,
        userId,
        carId,
      }
    );

    if (bookingResult.rowsAffected === 0) {
      return res
        .status(500)
        .json({ message: "Gagal membuat pemesanan, silakan coba lagi" });
    }

    const updateStatus = await queryAsync(
      "UPDATE kendaraan SET status = 'Tidak tersedia' WHERE ID_KENDARAAN = :carId",
      { carId }
    );

    if (updateStatus.rowsAffected === 0) {
      return res
        .status(500)
        .json({ message: "Gagal memperbarui status kendaraan" });
    }

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
