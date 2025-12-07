import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import eventRoutes from "./routes/events";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { checkDatabaseConnection } from "./config/database";

dotenv.config();

const app: Application = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/events", eventRoutes);

// Manejo de rutas no encontradas
app.use(notFoundHandler);

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    const dbConnected = await checkDatabaseConnection();

    if (!dbConnected) {
      console.error(
        "No se pudo conectar a la base de datos. Verifica tu configuración."
      );
      process.exit(1);
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\n🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📅 API Events: http://localhost:${PORT}/api/events\n`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();

export default app;
