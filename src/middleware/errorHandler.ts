import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Error:", err.stack);

  // Error de base de datos
  if (
    err.name === "QueryFailedError" ||
    err.message.includes("duplicate key")
  ) {
    res.status(409).json({
      success: false,
      error: "Error de base de datos",
      message: "El recurso ya existe o hay un conflicto con los datos",
    } as ApiResponse<null>);
    return;
  }

  // Error de validación
  if (err.name === "ValidationError") {
    res.status(400).json({
      success: false,
      error: "Error de validación",
      message: err.message,
    } as ApiResponse<null>);
    return;
  }

  // Error genérico del servidor
  res.status(500).json({
    success: false,
    error: "Error interno del servidor",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Ha ocurrido un error inesperado",
  } as ApiResponse<null>);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: "Ruta no encontrada",
    message: `La ruta ${req.method} ${req.path} no existe`,
  } as ApiResponse<null>);
};
