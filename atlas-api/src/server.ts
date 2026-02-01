import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/routes"; // <--- IMPORTANTE
import { testConnection } from "./database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: "http://localhost:3001", // Seu frontend roda em 3001
    credentials: true, // Permite enviar cookies
  }),
);
app.use(express.json());
app.use(router); // <--- IMPORTANTE

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  testConnection();
});
