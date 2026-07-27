const express = require("express");
const router = express.Router();

router.post("/webhook", async (req, res) => {
  try {
    const payload = req.body;

    console.log("================================");
    console.log("ELITECH MEDLINK WEBHOOK");
    console.log("================================");

    console.log(JSON.stringify(payload, null, 2));

    return res.status(200).json({
      success: true,
      message: "Webhook received successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
