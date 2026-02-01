import express from "express";
import cors from "cors";
import { router } from "./routes/routes";
import { testConnection } from "./database";
import { config } from "./config";

const app = express();
const PORT = config.port;

// Middlewares
app.use(cors(config.cors));
app.use(express.json());

// Routes
app.use(router);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Ambiente: ${config.nodeEnv}`);
  testConnection();
});
