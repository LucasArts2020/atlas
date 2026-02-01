import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5438"),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "atlas_db",
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || "MEU_SEGREDO_SUPER_SECRETO",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
    credentials: true,
  },

  // API
  api: {
    version: "1.0.0",
    prefix: "/api/v1",
  },
};

export default config;
