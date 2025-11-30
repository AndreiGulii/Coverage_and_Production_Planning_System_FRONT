// src/utils/utils.ts

import type { Task } from "../types/types";

/**
 * Преобразует дату в позицию по оси X
 * @param startDate Начало задачи
 * @param timelineStart Начало временной шкалы
 * @param pixelsPerDay Количество пикселей на один день
 * @returns Позиция по X
 */
export function dateToPosition(
  startDate: Date,
  timelineStart: Date,
  pixelsPerDay: number
): number {
  const diffTime = startDate.getTime() - timelineStart.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays * pixelsPerDay;
}

/**
 * Преобразует продолжительность задачи в ширину в пикселях
 * @param durationDays Продолжительность в днях
 * @param pixelsPerDay Количество пикселей на один день
 * @returns Ширина в пикселях
 */
export function durationToWidth(durationDays: number, pixelsPerDay: number): number {
  return durationDays * pixelsPerDay;
}

/**
 * Находит задачу по id
 * @param tasks Массив задач
 * @param id Идентификатор задачи
 * @returns Задача или undefined
 */
export function findTaskById(tasks: Task[], id: string): Task | undefined {
  return tasks.find(task => task.id === id);
}

/**
 * Сортирует задачи по стартовой дате
 * @param tasks Массив задач
 * @returns Новый массив задач, отсортированных по start
 */
export function sortTasksByStart(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => a.start - b.start);
}