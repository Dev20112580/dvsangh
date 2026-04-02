import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3001;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock Razorpay Order Creation
  app.post("/api/donations/create-order", (req, res) => {
    const { amount, currency } = req.body;
    res.json({
      id: `order_${Math.random().toString(36).substring(7)}`,
      amount,
      currency,
      status: "created"
    });
  });

  // Mock Scholarship Application
  app.post("/api/scholarships/apply", (req, res) => {
    res.json({
      success: true,
      applicationId: `APP_${Math.random().toString(36).substring(7).toUpperCase()}`,
      message: "Application received successfully"
    });
  });

  // Mock Contact Form Submission
  app.post("/api/contact", (req, res) => {
    res.json({
      success: true,
      message: "Message received successfully"
    });
  });

  // Mock Authentication
  app.post("/api/auth/register", (req, res) => {
    res.json({ success: true, message: "Registration successful" });
  });

  app.post("/api/auth/login", (req, res) => {
    res.json({ success: true, user: { id: '1', name: 'Test User', role: req.body.role } });
  });

  app.post("/api/auth/verify-otp", (req, res) => {
    res.json({ success: true, message: "OTP verified" });
  });
  
  // Mock Newsletter Subscription
  app.post("/api/newsletter/subscribe", (req, res) => {
    res.json({ success: true, message: "Subscribed successfully" });
  });

  // Vite middleware for development
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
