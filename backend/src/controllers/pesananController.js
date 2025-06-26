const express = require("express");
const queryAsync = require("../utils/db");
const fs = require("fs");
const path = require("path");
const { console } = require("inspector");


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
      "SELECT * FROM pemesanan WHERE ID_PEMESANAN = :id",
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
