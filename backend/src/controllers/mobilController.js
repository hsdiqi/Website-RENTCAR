const express = require("express");
const queryAsync = require("../utils/db");
const fs = require("fs");
const path = require("path");
// const { console } = require("inspector");


exports.showAllCar = async (req, res) => {
  try {
    const category = await queryAsync(
      "SELECT tipe_kategori FROM katalog_kendaraan"
    );
    if (category.length === 0) {
      return res.status(404).json({ message: "No category Found" });
    }

    const cars = await queryAsync(
      "SELECT * FROM kendaraan WHERE status != 'deleted'"
    );
    if (cars.length === 0) {
      return res.status(404).json({ message: "No cars Found" });
    }

    res.status(200).json({
      message: "Data kendaraan berhasil ditemukan",
      data: {
        category: category.map((cat) => cat.TIPE_KATEGORI),
        cars: cars,
      },
    });
  } catch (err) {
    console.error("Error fetching cars:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

exports.selectedCar = async (req, res) => {
  try {
    const id = req.body.carId;
    // console.log("id:", req.body)
    const car = await queryAsync(
      "SELECT * FROM  kendaraan WHERE ID_KENDARAAN = :id",
      { id }
    );
    if (car.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }
    // console.log("car:",car)
    // console.log("rows:", car.rows)
    // console.log("index0:", car[0])

    res.status(200).json({ message: "Car found", data: car[0] });
  } catch (err) {
    console.error("Error fetching car:", err);
  }
};

exports.updateCar = async (req, res) => {
  console.log("edit endpoint hit");
  try {
    // const { id } = req.params;
    const {
      id,
      nameCar,
      tipe,
      color,
      capacity,
      nopol,
      thnBeli,
      service,
      speed,
      harga,
      status
    } = req.body;
    const image = req.file;

    // console.log(id)

    const checkCar = await queryAsync(
      "SELECT * FROM kendaraan WHERE ID_KENDARAAN = :id",
      { id }
    );
    // console.log(checkCar)
    if (!checkCar || checkCar.rows.length === 0) {
      return res.status(404).json({ message: "Kendaraan tidak ditemukan." });
    }

    const carData = checkCar.rows[0];
    console.log(carData);

    let updateFields = [];
    let bindParams = { id };

    if (nameCar !== undefined) {
      updateFields.push("NAMA_KENDARAAN = :nameCar");
      bindParams.nameCar = nameCar;
    }

    if (tipe !== undefined) {
      const idResult = await queryAsync(
        `SELECT * FROM katalog_kendaraan WHERE TRIM(UPPER(tipe_kategori)) = TRIM(UPPER(:tipe))`,
        { tipe }
      );
      if (!idResult || idResult.length === 0) {
        return res
          .status(404)
          .json({ message: "Tipe kategori tidak ditemukan dalam database." });
      }

      updateFields.push("TIPE_KENDARAAN = :tipe");
      updateFields.push(`KATALOG_KENDARAAN_ID_KATEGORI = :idKategori`);
      bindParams.tipe = tipe;
      bindParams.idKategori = idResult.rows[0].ID_KATEGORI;
    }

    if (harga !== undefined) {
      updateFields.push("HARGA = :harga");
      bindParams.harga = parseFloat(harga);
    }

    if (color !== undefined) {
      updateFields.push("WARNA = :color");
      bindParams.color = color;
    }

    if (capacity !== undefined) {
      updateFields.push("CAP_PENUMPANG = :capacity");
      bindParams.capacity = parseInt(capacity, 10);
    }

    if (thnBeli !== undefined) {
      updateFields.push("TAHUN_BELI = :thnBeli");
      bindParams.thnBeli = parseInt(thnBeli, 10);
    }

    if (speed !== undefined) {
      updateFields.push("TOP_SPEED = :speed");
      bindParams.speed = parseFloat(speed);
    }

    if (service !== undefined) {
      updateFields.push("LAST_SERVICE = TO_DATE(:service, 'YYYY-MM-DD')");
      bindParams.service = service;
    }

    if (nopol !== undefined) {
      updateFields.push("NOPOL = :nopol");
      bindParams.nopol = nopol;
    }
    if (status !== undefined) {
      updateFields.push("STATUS = :status");
      bindParams.status = status;
    }

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
        "cars"
      );
      const oldPath = path.join(imagePath, carData.FOTO_KENDARAAN);
      const newPath = path.join(imagePath, uniqueName);

      fs.writeFileSync(newPath, image.buffer);

      if (carData.FOTO_KENDARAAN && fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        console.log(`Deleted old image: ${oldPath}`);
      }
      updateFields.push("FOTO_KENDARAAN = :foto");
      bindParams.foto = uniqueName;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: "Tidak ada perubahan data" });
    }

    const updateQuery = `UPDATE kendaraan SET ${updateFields.join(
      ", "
    )} WHERE ID_KENDARAAN = :id`;
    await queryAsync(updateQuery, bindParams);
    console.log("sekses");

    res.status(200).json({
      message: "Kendaraan berhasil diperbarui",
      updateData: Object.keys(bindParams).filter((key) => key !== "id"),
    });
  } catch (error) {}
};

exports.deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if the car exists
    const car = await queryAsync(
      "SELECT * FROM kendaraan WHERE ID_KENDARAAN = :id",
      { id }
    );
    if (car.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }
    // Update the status to 'deleted'
    await queryAsync(
      "UPDATE kendaraan SET status = 'deleted' WHERE ID_KENDARAAN = :id",
      { id }
    );
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};