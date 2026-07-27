const express = require("express");

const {
  getDevice,
  getBMI,
  getGateway,
  getJenisPengukuran,
} = require("../services/medlinkService");

const router = express.Router();

router.get("/devices", async (req, res) => {
  try {
    const data = await getDevice(req.query);

    res.status(200).json(data);
  } catch (error) {
    console.error(
      "Error mengambil data device dari Medlink:",
      error.response?.data || error.message,
    );

    res.status(error.response?.status || 500).json({
      message: "Gagal mengambil data device dari Medlink",
      error: error.response?.data || error.message,
    });
  }
});

router.get("/bmi", async (req, res) => {
  try {
    const data = await getBMI(req.query);

    res.status(200).json(data);
  } catch (error) {
    console.error(
      "Error kalkulasi BMI:",
      error.response?.data || error.message,
    );

    res.status(error.response?.status || 500).json({
      message: "Gagal melakukan kalkulasi BMI",
      error: error.response?.data || error.message,
    });
  }
});

router.get("/gateway", async (req, res) => {
  try {
    const data = await getGateway();

    res.status(200).json(data);
  } catch (error) {
    console.error(
      "Error mengambil gateway:",
      error.response?.data || error.message,
    );

    res.status(error.response?.status || 500).json({
      message: "Gagal mengambil data gateway dari Medlink",
      error: error.response?.data || error.message,
    });
  }
});

router.get("/jenis-pengukuran", async (req, res) => {
  try {
    const data = await getJenisPengukuran();

    res.status(200).json(data);
  } catch (error) {
    console.error(
      "Error mengambil parameter pengukuran:",
      error.response?.data || error.message,
    );

    res.status(error.response?.status || 500).json({
      message: "Gagal mengambil jenis pengukuran dari Medlink",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
