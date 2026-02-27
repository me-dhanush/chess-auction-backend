require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const app = express();
app.use(cors());
app.use(express.json());

// Environment variables
const appId = process.env.AGORA_APP_ID;
const appCertificate = process.env.AGORA_APP_CERTIFICATE;

// Validate environment variables at startup
if (!appId || !appCertificate) {
  console.error("❌ Missing AGORA_APP_ID or AGORA_APP_CERTIFICATE");
  process.exit(1);
}

// Health check route (so Render root doesn't 404)
app.get("/", (req, res) => {
  res.send("Chess Auction Backend is running 🚀");
});

// Token generation route
app.get("/generate-token", (req, res) => {
  try {
    const { channelName, uid } = req.query;

    if (!channelName) {
      return res.status(400).json({ error: "Channel name is required" });
    }

    const numericUid = uid ? parseInt(uid, 10) : 0;

    const role = RtcRole.PUBLISHER;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      numericUid,
      role,
      3600,
      3600
    );

    return res.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    return res.status(500).json({ error: "Failed to generate token" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});