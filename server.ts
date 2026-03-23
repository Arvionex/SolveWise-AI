import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Razorpay API Route
  app.post("/api/payment", async (req, res) => {
    try {
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || "",
        key_secret: process.env.RAZORPAY_KEY_SECRET || "",
      });

      const options = {
        amount: 5000, // ₹50 in paise
        currency: "INR",
        receipt: "receipt_" + Math.random().toString(36).substring(7),
      };

      const order = await instance.orders.create(options);

      if (!order) {
        return res.status(500).send("Some error occured");
      }

      res.json(order);
    } catch (error) {
      console.error("Razorpay error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Keep the old one for compatibility if needed, but the user asked for /api/payment
  app.post("/api/create-order", (req, res) => {
    const { amount } = req.body;
    res.json({
      id: "order_" + Math.random().toString(36).substr(2, 9),
      amount: amount * 100,
      currency: "INR",
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
