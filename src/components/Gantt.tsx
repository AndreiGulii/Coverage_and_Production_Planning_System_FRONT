// src/components/Gantt.tsx

import React from "react";

export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  row: number; // индекс строки на диаграмме
  color?: string;
}

interface GanttProps {
  tasks: GanttTask[];
  timelineStart: Date;
  pixelsPerDay: number;
}

const Gantt: React.FC<GanttProps> = ({ tasks, timelineStart, pixelsPerDay }) => {

  // Преобразуем дату в пиксели от начала таймлайна
  const dateToPosition = (date: Date) => {
    const diffMs = date.getTime() - timelineStart.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays * pixelsPerDay;
  };

  const durationToWidth = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays * pixelsPerDay;
  };

  return (
    <div style={{ position: "relative", width: "100%", border: "1px solid #ccc", padding: "10px" }}>
      {tasks.map(task => {
        const x = dateToPosition(task.start);
        const width = durationToWidth(task.start, task.end);

        return (
          <div
            key={task.id}
            style={{
              position: "absolute",
              left: x,
              top: task.row * 40, // высота строки на диаграмме
              width: width,
              height: 30,
              backgroundColor: task.color || "#4caf50",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
            }}
          >
            {task.name}
          </div>
        );
      })}
    </div>
  );
};

export default Gantt;