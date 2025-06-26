const express = require("express");
const queryAsync = require("../utils/db");
const fs = require("fs");
const path = require("path");
const bcrypt = require('bcrypt')
// const { console } = require("inspector");

exports.showAllPelanggan = async (req, res) => {
  try {
    const users = await queryAsync(
      "SELECT * FROM v_pelanggan_membership WHERE status != 'deleted'"
    );
    if (users.length === 0) {
      return res.status(404).json({ message: "No Data Found" });
    }
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

exports.updatePelanggan = async (req, res) => {
  console.log("edit pelanggan");
  try {
    const {
      userID,
      namaDepan,
      namaBelakang,
      nik,
      email,
      notelp,
      alamat,
      memberID,
      pointMember,
      password, // jika tidak dipakai, bisa dihapus
    } = req.body;
    const image = req.file;

    console.log(
      `id: ${userID}, namaDepan: ${namaDepan}, namaBelakang: ${namaBelakang}, email: ${email}, nik: ${nik}, no: ${notelp}, alamat: ${alamat}, membership: ${memberID}, point: ${pointMember}, image: ${image ? image.originalname : 'none'}, password: ${password}`
    );

    const id = userID;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await queryAsync(
      "SELECT * FROM pelanggan WHERE ID_PELANGGAN = :id",
      { id }
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update pelanggan data (tanpa gambar)
    await queryAsync(
      `UPDATE pelanggan 
       SET NAMA_DEPAN = :namaDepan,
           NAMA_BELAKANG = :namaBelakang,
           EMAIL = :email,
           NOMOR_TELEPON = :notelp,
           ALAMAT = :alamat,
           MEMBER_ID_PELANGGAN = :memberId,
           POINT_MEMBERSHIP = :pointMember,
           PASSWORD = :password
       WHERE ID_PELANGGAN = :id`,
      {
        namaDepan,
        namaBelakang,
        email,
        notelp,
        alamat,
        memberID,
        pointMember,
        password: hashedPassword,
        id,
      }
    );

    // Update gambar jika ada
    if (image) {
      const originalname = image.originalname;
      const uniqueName = `${Date.now()}-${originalname}`;
      const imagePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "uploads",
        "images",
        "pelanggan"
      );
      const newPath = path.join(imagePath, uniqueName);

      // Buat direktori jika belum ada
      if (!fs.existsSync(imagePath)) {
        fs.mkdirSync(imagePath, { recursive: true });
      }

      // Hapus gambar lama jika ada
      const oldImage = user[0].FOTO_PELANGGAN;
      if (oldImage) {
        const oldPath = path.join(imagePath, oldImage);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          console.log(`Deleted old image: ${oldPath}`);
        }
      }

      // Simpan gambar baru
      fs.writeFileSync(newPath, image.buffer);

      await queryAsync(
        `UPDATE pelanggan 
         SET FOTO_PELANGGAN = :foto 
         WHERE ID_PELANGGAN = :id`,
        {
          foto: uniqueName,
          id,
        }
      );
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.deletePelanggan = async (req, res) => {
  console.log("delet pelanggan");
  try {
    const { id } = req.body;
    console.log(id);

    // Check if the user exists
    const user = await queryAsync(
      "SELECT * FROM pelanggan WHERE ID_PELANGGAN = :id",
      { id }
    );
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the status to 'deleted'
    await queryAsync(
      "UPDATE pelanggan SET status = 'deleted' WHERE ID_PELANGGAN = :id",
      { id }
    );

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {}
};
