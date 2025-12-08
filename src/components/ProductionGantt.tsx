import React, { useEffect, useState } from "react";
import { Gantt} from "gantt-task-react";
import type { Task } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import axios from "axios";

interface BOM {
  id: string;
  productId: string;
  productName: string;
  materialId: string;
  materialName: string;
}

const DURATION = 60 * 60 * 1000; // 1 час

const ProductionGantt: React.FC = () => {
  const [boms, setBoms] = useState<BOM[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchBOMs = async () => {
      try {
        const response = await axios.get<BOM[]>("/api/boms");
        setBoms(response.data);
      } catch (error) {
        console.error("Failed to fetch BOMs:", error);
      }
    };
    fetchBOMs();
  }, []);

  useEffect(() => {
    if (!boms.length) return;

    const taskMap = new Map<string, Task>();

    const calculateTask = (productId: string): Task => {
      if (taskMap.has(productId)) return taskMap.get(productId)!;

      const productBOMs = boms.filter(b => b.productId === productId);
      let start = new Date();

      if (productBOMs.length > 0) {
        // Вычисляем, когда все материалы будут готовы
        const materialEndTimes = productBOMs.map(bom => {
          // Если материал сам является продуктом, рекурсивно
          const materialTask = boms.some(b => b.productId === bom.materialId)
            ? calculateTask(bom.materialId)
            : {
                start,
                end: new Date(start.getTime() + DURATION),
              };
          return materialTask.end;
        });
        start = new Date(Math.max(...materialEndTimes.map(d => d.getTime())));
      }

      const end = new Date(start.getTime() + DURATION);
      const task: Task = {
        id: productId,
        name: productBOMs[0]?.productName || `Product ${productId}`,
        start,
        end,
        type: "task",
        progress: 0,
        project: "Production",
      };

      taskMap.set(productId, task);
      return task;
    };

    // Создаем задачи для всех уникальных продуктов
    const uniqueProducts = Array.from(new Set(boms.map(b => b.productId)));
    const allTasks = uniqueProducts.map(calculateTask);

    setTasks(allTasks);
  }, [boms]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Production Gantt</h2>
      {tasks.length > 0 ? <Gantt tasks={tasks} /> : <p>Loading tasks...</p>}
    </div>
  );
};

export default ProductionGantt;