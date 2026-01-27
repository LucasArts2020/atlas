import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Bem-vindo ao Atlas API 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
