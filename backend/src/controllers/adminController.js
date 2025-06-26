const express = require("express");
const queryAsync = require("../utils/db");
const fs = require("fs");
const path = require("path");
const { console } = require("inspector");
// const { saveImageBuffer } = require("../utils/fileSaver");
// const router = express.Router();

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
  try {
    // const { id } = req.params;
    const { id, nama, email, no_telp, alamat, membership } = req.body;
    const image = req.file;
    // Check if the user exists
    const user = await queryAsync(
      "SELECT * FROM pelanggan WHERE ID_PELANGGAN = :id",
      { id }
    );
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update the user details
    await queryAsync(
      "UPDATE pelanggan SET NAMA = :nama, EMAIL = :email, NO_TELP = :no_telp, ALAMAT = :alamat, membership = :membership WHERE ID_PELANGGAN = :id",
      { nama, email, no_telp, alamat, membership, id }
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
        "pelanggan"
      );
      const oldPath = path.join(imagePath, user.FOTO_PELANGGAN);
      const newPath = path.join(imagePath, uniqueName);

      fs.writeFileSync(newPath, image.buffer);

      if (user.FOTO_PELANGGAN && fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
        console.log(`Deleted old image: ${oldPath}`);
      }
      queryAsync(
        "UPDATE karyawan SET FOTO_PELANGGAN = :foto WHERE ID_PELANGGAN = :id",
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

exports.showAllPesanan = async (req, res) => {
  try {
    const orders = await queryAsync("SELECT * FROM v_detail_pesanan");
    if (orders.length === 0) {
      return res.status(404).json({ message: "No Data Found" });
    }
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

exports.updatePesanan = async (req, res) => {
  try {
    const {
      bookingID,
      userID,
      paymentID,
      namaDepan,
      namaBelakang,
      notelp,
      datePick,
      returnDate,
      statusBooking,
      email,
      methodPayment,
      datePayment,
    } = req.body;

    // Check if the order exists
    const order = await queryAsync(
      "SELECT * FROM pesanan WHERE ID_PEMESANAN = :id",
      { id: bookingID }
    );
    if (order.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updatePayment = await queryAsync(
      `UPDATE pembayaran
        SET metode_pembayaran = :methodPayment,
        tanggal_pembayaran = TO_DATE(:datePayment, 'YYYY-MM-DD')
        WHERE id_pembayaran = :paymentID`,
      { methodPayment, datePayment, paymentID }
    );

    const updateBooking = await queryAsync(
      `UPDATE pemesanan
          SET tanggal_mulai_sewa = TO_DATE(:datePick, 'YYYY-MM-DD'),
          tanggal_akhir_sewa = TO_DATE(:returnDate, 'YYYY-MM-DD'),
          status_pemesanan = :statusBooking
          WHERE id_pemesanan = :bookingID`,
      { datePick, returnDate, statusBooking, bookingID }
    );

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.deletePesanan = async (req, res) => {
  console.log("pesana delte");
  try {
    const { id } = req.body;
    console.log("id yang dikirim:", id, typeof id);

    // Check if the order exists
    const order = await queryAsync(
      "SELECT * FROM pemesanan WHERE ID_PEMESANAN = :id",
      { id }
    );
    console.log(order.length);
    if (order.length === 0) {
      console.log(order);
      return res.status(404).json({
        message: "pesanan tidak ada",
        data: order,
      });
    }

    // Update the status to 'deleted'
    await queryAsync(
      "UPDATE pemesanan SET status_pemesanan = 'deleted' WHERE ID_PEMESANAN = :id",
      { id }
    );

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const allCars = await queryAsync(
      `select * from kendaraan where status != 'deleted'`
    );
    const allPelanggan = await queryAsync(
      `select * from pelanggan where status != 'deleted'`
    );
    const allKaryawan = await queryAsync(
      `select * from karyawan where status != 'deleted'`
    );
    const allPesanan = await queryAsync(
      `select * from v_pesanan where status_pemesanan != 'deleted'`
    );

    // console.log("All Cars:", allCars);
    // console.log("All Pelanggan:", allPelanggan);
    // console.log("All Karyawan:", allKaryawan);
    // console.log("All Pesanan:", allPesanan);

    res.status(200).json({
      message: "Dashboard data retrieved successfully",
      data: {
        cars: allCars,
        pelanggan: allPelanggan,
        karyawan: allKaryawan,
        pesanan: allPesanan,
      },
    });
  } catch (error) {
    console.error("Error retrieving dashboard data:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
