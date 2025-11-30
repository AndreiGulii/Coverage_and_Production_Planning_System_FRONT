import React, { useEffect, useState } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import type { Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import ProductionAPI from "../api/ProductionAPI";
import type { Production } from "../api/ProductionAPI";
import moment from "moment";

interface GanttTask extends Task {
  itemId?: number;
  quantity?: number;
  setupTime?: number;
  minBatch?: number;
  intervalBatch?: number;
  productionTimePerUnit?: number;
  isSetup?: boolean;
}

const workShifts = [
  { start: "06:00", end: "14:00" },
  { start: "14:00", end: "22:00" },
  { start: "22:00", end: "06:00" },
];

const getMinutes = (timeString: string) => {
  const [h, m] = timeString.split(":").map(Number);
  return h * 60 + m;
};

const getCurrentShift = (date: Date) => {
  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  for (const shift of workShifts) {
    const start = getMinutes(shift.start);
    let end = getMinutes(shift.end);
    if (end < start) end += 1440;
    let current = currentMinutes;
    if (current < start) current += 1440;
    if (current >= start && current < end) return shift;
  }
  return workShifts[0];
};

const nextShiftStart = (date: Date) => {
  const shift = getCurrentShift(date);
  const [endH, endM] = shift.end.split(":").map(Number);
  const next = new Date(date);
  next.setHours(endH, endM, 0, 0);
  if (endH < parseInt(shift.start)) next.setDate(next.getDate() + 1);
  return next;
};

const calculateRealEnd = (start: Date, durationMinutes: number) => {
  let current = new Date(start);
  let remaining = durationMinutes;

  while (remaining > 0) {
    const shift = getCurrentShift(current);
    const shiftEnd = new Date(current);
    const [endH, endM] = shift.end.split(":").map(Number);
    shiftEnd.setHours(endH, endM, 0, 0);
    if (endH < parseInt(shift.start)) shiftEnd.setDate(shiftEnd.getDate() + 1);

    const available = (shiftEnd.getTime() - current.getTime()) / 60000;

    if (available >= remaining) {
      current = new Date(current.getTime() + remaining * 60000);
      remaining = 0;
    } else {
      remaining -= available;
      current = nextShiftStart(current);
    }
  }

  return current;
};

const ProductionGantt: React.FC = () => {
  const [tasks, setTasks] = useState<GanttTask[]>([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await ProductionAPI.getAll();
      const plans = res.data;

      const grouped: Record<string, Production[]> = {};

      plans.forEach(plan => {
        if (!plan.startTime) return; // пропускаем если нет startTime
        const machine = `Machine-${plan.machineId}`;
        if (!grouped[machine]) grouped[machine] = [];
        grouped[machine].push(plan);
      });

      const prepared: GanttTask[] = [];

      Object.keys(grouped).forEach(machine => {
        let prevEnd: Date | null = null;
        let prevProductId: number | null = null;

        grouped[machine]
          .sort((a, b) => new Date(a.startTime || "").getTime() - new Date(b.startTime || "").getTime())
          .forEach(plan => {
            if (!plan.startTime) return;

            const startDate = new Date(plan.startTime);
            if (isNaN(startDate.getTime())) return;

            let quantity = plan.quantity ?? 0;
            if (plan.minBatch && quantity < plan.minBatch) quantity = plan.minBatch;
            if (plan.intervalBatch && quantity % plan.intervalBatch !== 0)
              quantity = Math.ceil(quantity / plan.intervalBatch) * plan.intervalBatch;

            const duration = (plan.productionTimePerUnit ?? 0) * quantity;
            let start = startDate;

            // Переналадка
            if (prevEnd && prevProductId !== plan.itemId && plan.setupTime) {
              const setupStart = prevEnd;
              const setupEnd = calculateRealEnd(setupStart, plan.setupTime);

              if (!isNaN(setupStart.getTime()) && !isNaN(setupEnd.getTime())) {
                prepared.push({
                  id: `setup-${plan.id}`,
                  name: `Переналадка (${prevProductId} → ${plan.itemId})`,
                  start: setupStart,
                  end: setupEnd,
                  project: machine,
                  isSetup: true,
                  type: "task",
                  progress: 100,
                  styles: { backgroundColor: "#ff9800", progressColor: "#ffa726" },
                });
              }

              start = setupEnd;
            }

            const end = calculateRealEnd(start, duration);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

            prepared.push({
              id: plan.id?.toString() || Math.random().toString(),
              name: `${plan.itemName || "Продукт"} (${quantity} шт)`,
              start,
              end,
              project: machine,
              type: "task",
              progress: 0,
              itemId: plan.itemId,
              quantity,
              setupTime: plan.setupTime,
              minBatch: plan.minBatch,
              intervalBatch: plan.intervalBatch,
              productionTimePerUnit: plan.productionTimePerUnit,
              styles: { backgroundColor: "#4caf50", progressColor: "#81c784" },
            });

            prevEnd = end;
            prevProductId = plan.itemId;
          });
      });

      console.log("Prepared tasks:", prepared);
      setTasks(prepared);
    } catch (err) {
      console.error("Ошибка при загрузке плана:", err);
    }
  };

  const handleTaskChange = () => {
    fetchPlans();
  };

  const customBackground = () => {
    const days = [];
    const start = moment().startOf("day");
    const end = moment().add(7, "days");

    for (let m = start.clone(); m.isBefore(end); m.add(1, "hours")) {
      const hour = m.hour();
      const style = {
        left: `${m.diff(start, "hours") * 50}px`,
        width: `50px`,
        top: 0,
        bottom: 0,
        position: "absolute" as const,
        background: hour >= 22 || hour < 6 ? "#f0f0f0" : "transparent",
      };
      days.push(<div key={m.toString()} style={style} />);
    }

    return <>{days}</>;
  };

  return (
    <div style={{ position: "relative" }}>
      <h2>График производства (смены + minBatch + intervalBatch)</h2>
      {customBackground()}
      <Gantt
        tasks={tasks}
        viewMode={ViewMode.Day}
        listCellWidth="250 px"
        onDateChange={handleTaskChange}
      />
    </div>
  );
};

export default ProductionGantt;