// src/types/types.ts

export interface Task {
  id: string;        // уникальный идентификатор задачи
  name: string;      // название задачи
  start: number;     // стартовая позиция на шкале времени (например, в пикселях)
  duration: number;  // продолжительность задачи (например, в пикселях)
}