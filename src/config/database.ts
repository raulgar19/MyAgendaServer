import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

const poolConfig: PoolConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  min: parseInt(process.env.DB_POOL_MIN!),
  max: parseInt(process.env.DB_POOL_MAX!),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new Pool(poolConfig);

// Manejo de errores del pool
pool.on("error", (err) => {
  console.error("Error inesperado en el pool de conexiones:", err);
  process.exit(-1);
});

// Verificar conexión al iniciar
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release();
    console.log("✅ Conexión a PostgreSQL establecida correctamente");
    return true;
  } catch (error) {
    console.error("❌ Error al conectar con PostgreSQL:", error);
    return false;
  }
};
