import { Router } from "express";
import { EventController } from "../controllers/eventController";

const router = Router();

// GET /api/events - Obtener todos los eventos (con filtros opcionales)
router.get("/", EventController.getEvents);

// GET /api/events/:id - Obtener evento por ID
router.get("/:id", EventController.getEventById);

// POST /api/events - Crear nuevo evento
router.post("/", EventController.createEvent);

// PUT /api/events/:id - Actualizar evento
router.put("/:id", EventController.updateEvent);

// DELETE /api/events/:id - Eliminar evento
router.delete("/:id", EventController.deleteEvent);

export default router;
