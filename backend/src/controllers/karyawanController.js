const express = require("express");
const queryAsync = require("../utils/db");
const fs = require("fs");
const path = require("path");
const { console } = require("inspector");


exports.showAllKaryawan = async (req, res) => {
  try {
    const users = await queryAsync(
      "SELECT * FROM karyawan WHERE status != 'deleted'"
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



exports.updateKaryawan = async (req, res) => {
  try {
    const { id, nama, email, no_telp, alamat, jabatan } = req.body;
    // Check if the user exists
    const user = await queryAsync(
      "SELECT * FROM karyawan WHERE ID_KARYAWAN = :id",
      { id }
    );
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update the user details
    await queryAsync(
      "UPDATE karyawan SET NAMA = :nama, EMAIL = :email, NO_TELP = :no_telp, ALAMAT = :alamat, JABATAN = :jabatan WHERE ID_KARYAWAN = :id",
      { nama, email, no_telp, alamat, jabatan, id }
    );

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
        "karyawan"
      );
      const oldPath = path.join(imagePath, user.FOTO_KARYAWAN);
      const newPath = path.join(imagePath, uniqueName);

      fs.writeFileSync(newPath, image.buffer);

      if (user.FOTO_KARYAWAN && fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        console.log(`Deleted old image: ${oldPath}`);
      }
      queryAsync(
        "UPDATE karyawan SET FOTO_KARYAWAN = :foto WHERE ID_KARYAWAN = :id",
        { foto: uniqueName, id }
      );
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.deleteKaryawan = async (req, res) => {
  try {
    const { id } = req.body;
    // Check if the user exists
    const user = await queryAsync(
      "SELECT * FROM karyawan WHERE ID_KARYAWAN = :id",
      { id }
    );
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update the status to 'deleted'
    await queryAsync(
      "UPDATE karyawan SET status = 'deleted' WHERE ID_KARYAWAN = :id",
      { id }
    );
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};