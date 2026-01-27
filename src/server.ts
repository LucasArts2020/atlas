import express from "express";
import dotenv from "dotenv";
import { router } from "./routes/routes"; // <--- IMPORTANTE
import { testConnection } from "./database";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(router); // <--- IMPORTANTE

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  testConnection();
});
