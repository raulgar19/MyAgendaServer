import { Request, Response, NextFunction } from "express";
import { EventModel } from "../models/Event";
import { CreateEventDTO, UpdateEventDTO, ApiResponse } from "../types";

export class EventController {
  // Crear evento
  static async createEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const eventData: CreateEventDTO = req.body;

      // Validaciones básicas
      if (!eventData.title || !eventData.start_time) {
        res.status(400).json({
          success: false,
          error: "Título y fecha de inicio son requeridos",
        } as ApiResponse<null>);
        return;
      }

      const event = await EventModel.create(eventData);

      res.status(201).json({
        success: true,
        data: event,
        message: "Evento creado exitosamente",
      } as ApiResponse<typeof event>);
    } catch (error) {
      next(error);
    }
  }

  // Obtener evento por ID
  static async getEventById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID inválido",
        } as ApiResponse<null>);
        return;
      }

      const event = await EventModel.findById(id);

      if (!event) {
        res.status(404).json({
          success: false,
          error: "Evento no encontrado",
        } as ApiResponse<null>);
        return;
      }

      res.status(200).json({
        success: true,
        data: event,
      } as ApiResponse<typeof event>);
    } catch (error) {
      next(error);
    }
  }

  // Obtener eventos (con filtros opcionales)
  static async getEvents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { startDate, endDate, limit, offset } = req.query;

      const filters = {
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };

      const events =
        filters.startDate || filters.endDate
          ? await EventModel.findByDateRange(filters)
          : await EventModel.findAll(filters.limit, filters.offset || 0);

      res.status(200).json({
        success: true,
        data: events,
      } as ApiResponse<typeof events>);
    } catch (error) {
      next(error);
    }
  }

  // Actualizar evento
  static async updateEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const eventData: UpdateEventDTO = req.body;

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID inválido",
        } as ApiResponse<null>);
        return;
      }

      const event = await EventModel.update(id, eventData);

      if (!event) {
        res.status(404).json({
          success: false,
          error: "Evento no encontrado",
        } as ApiResponse<null>);
        return;
      }

      res.status(200).json({
        success: true,
        data: event,
        message: "Evento actualizado exitosamente",
      } as ApiResponse<typeof event>);
    } catch (error) {
      next(error);
    }
  }

  // Eliminar evento
  static async deleteEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: "ID inválido",
        } as ApiResponse<null>);
        return;
      }

      const deleted = await EventModel.delete(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: "Evento no encontrado",
        } as ApiResponse<null>);
        return;
      }

      res.status(200).json({
        success: true,
        message: "Evento eliminado exitosamente",
      } as ApiResponse<null>);
    } catch (error) {
      next(error);
    }
  }
}
