const express = require("express");
const queryAsync = require("../utils/db");
const { saveImageBuffer } = require("../utils/fileSaver");
const router = express.Router();

exports.review = async (req, res) => {
  try {
    const review = await queryAsync(`SELECT *
         FROM (
           SELECT *
           FROM V_PELANGGAN_MEMBERSHIP
           WHERE JENIS_MEMBERSHIP = 'Gold' AND STATUS != 'deleted'
         )
         WHERE ROWNUM <= 4`);

    if (review.length === 0) {
      return res.status(404).json({ message: "No Data Found" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.mostBooking = async (req, res) => {
  try {
    const mostBooking = await queryAsync(
      `SELECT *
         FROM (
           SELECT *
           FROM V_KENDARAAN_MOSTBOOK
           ORDER BY BANYAK_SEWA DESC
         )
         WHERE status != 'Deleted' AND ROWNUM <= 3`
    );

    if (mostBooking.length === 0) {
      return res.status(404).json({ message: "No Data Found" });
    }

    res.status(200).json({
      message: "Most Booked Cars",
      data: mostBooking,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
