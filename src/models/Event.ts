import { pool } from "../config/database";
import { Event, CreateEventDTO, UpdateEventDTO, QueryFilters } from "../types";
import { QueryResult } from "pg";

export class EventModel {
  // Crear evento
  static async create(eventData: CreateEventDTO): Promise<Event> {
    const query = `
      INSERT INTO events (title, start_time, location)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [
      eventData.title,
      eventData.start_time,
      eventData.location || null,
    ];

    const result: QueryResult<Event> = await pool.query(query, values);
    return result.rows[0];
  }

  // Obtener evento por ID
  static async findById(id: number): Promise<Event | null> {
    const query = "SELECT * FROM events WHERE id = $1";
    const result: QueryResult<Event> = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Obtener eventos por rango de fechas
  static async findByDateRange(filters: QueryFilters): Promise<Event[]> {
    let query = `
      SELECT * FROM events
      WHERE 1=1
    `;
    const values: any[] = [];
    let paramCount = 1;

    if (filters.startDate) {
      query += ` AND start_time >= $${paramCount}`;
      values.push(filters.startDate);
      paramCount++;
    }

    if (filters.endDate) {
      query += ` AND start_time <= $${paramCount}`;
      values.push(filters.endDate);
      paramCount++;
    }

    query += " ORDER BY start_time ASC";

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result: QueryResult<Event> = await pool.query(query, values);
    return result.rows;
  }

  // Actualizar evento
  static async update(
    id: number,
    eventData: UpdateEventDTO
  ): Promise<Event | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (eventData.title !== undefined) {
      updates.push(`title = $${paramCount}`);
      values.push(eventData.title);
      paramCount++;
    }

    if (eventData.start_time !== undefined) {
      updates.push(`start_time = $${paramCount}`);
      values.push(eventData.start_time);
      paramCount++;
    }

    if (eventData.location !== undefined) {
      updates.push(`location = $${paramCount}`);
      values.push(eventData.location);
      paramCount++;
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    const query = `
      UPDATE events
      SET ${updates.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result: QueryResult<Event> = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Eliminar evento
  static async delete(id: number): Promise<boolean> {
    const query = "DELETE FROM events WHERE id = $1 RETURNING id";
    const result: QueryResult = await pool.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Obtener todos los eventos
  static async findAll(
    limit: number = 100,
    offset: number = 0
  ): Promise<Event[]> {
    const query = `
      SELECT * FROM events
      ORDER BY start_time ASC
      LIMIT $1 OFFSET $2
    `;
    const result: QueryResult<Event> = await pool.query(query, [limit, offset]);
    return result.rows;
  }
}
