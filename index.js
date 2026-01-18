const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Load service account
const serviceAccount = require("./service-account.json");

// ✅ Firebase Admin init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ✅ Test route
app.get("/", (req, res) => {
  res.json({ status: true, message: "RonZo FCM Server Running ✅" });
});

// ✅ Send notification to token
app.post("/send", async (req, res) => {
  try {
    const { token, title, body, data } = req.body;

    if (!token || !title || !body) {
      return res.status(400).json({
        status: false,
        message: "token/title/body required",
      });
    }

    const message = {
      token: token,
      notification: {
        title: title,
        body: body,
      },
      data: data || {},
    };

    const response = await admin.messaging().send(message);

    return res.json({
      status: true,
      message: "Notification sent ✅",
      response: response,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Error sending notification",
      error: err.message,
    });
  }
});

// ✅ Send notification to topic
app.post("/send-topic", async (req, res) => {
  try {
    const { topic, title, body, data } = req.body;

    if (!topic || !title || !body) {
      return res.status(400).json({
        status: false,
        message: "topic/title/body required",
      });
    }

    const message = {
      topic: topic,
      notification: {
        title: title,
        body: body,
      },
      data: data || {},
    };

    const response = await admin.messaging().send(message);

    return res.json({
      status: true,
      message: "Topic notification sent ✅",
      response: response,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Error sending topic notification",
      error: err.message,
    });
  }
});

// ✅ Railway port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port:", PORT));
