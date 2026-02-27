app.get("/generate-token", (req, res) => {
  try {
    const { channelName, uid } = req.query;

    if (!channelName) {
      return res.status(400).json({ error: "Channel name is required" });
    }

    const numericUid = uid ? parseInt(uid, 10) : 0;
    const role = RtcRole.PUBLISHER;

    // ✅ Proper expiration calculation
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expireTime = 3600; // 1 hour
    const privilegeExpireTime = currentTimestamp + expireTime;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      numericUid,
      role,
      privilegeExpireTime
    );

    return res.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    return res.status(500).json({ error: "Failed to generate token" });
  }
});