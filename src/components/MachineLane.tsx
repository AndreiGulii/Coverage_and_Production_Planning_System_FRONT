import React, { useState, useRef } from 'react';
import type { Task } from '../types/types';
import './MachineLane.css'; // можно добавить стили для полосы и задач

interface MachineLaneProps {
  machineName: string;
  tasks: Task[];
  onTaskUpdate: (updatedTask: Task) => void;
}

const MachineLane: React.FC<MachineLaneProps> = ({ machineName, tasks, onTaskUpdate }) => {
  const laneRef = useRef<HTMLDivElement>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [resizingTaskId, setResizingTaskId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const handleMouseDown = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setDraggingTaskId(taskId);
    const taskElement = e.currentTarget as HTMLDivElement;
    setDragOffset(e.clientX - taskElement.getBoundingClientRect().left);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingTaskId || !laneRef.current) return;
    const laneRect = laneRef.current.getBoundingClientRect();
    const newStart = Math.max(0, e.clientX - laneRect.left - dragOffset);

    const task = tasks.find(t => t.id === draggingTaskId);
    if (!task) return;

    const updatedTask = {
      ...task,
      start: newStart,
    };
    onTaskUpdate(updatedTask);
  };

  const handleMouseUp = () => {
    setDraggingTaskId(null);
    setResizingTaskId(null);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setResizingTaskId(taskId);
  };

  const handleResizeMouseMove = (e: React.MouseEvent) => {
    if (!resizingTaskId || !laneRef.current) return;
    const laneRect = laneRef.current.getBoundingClientRect();
    const task = tasks.find(t => t.id === resizingTaskId);
    if (!task) return;

    const newWidth = Math.max(20, e.clientX - laneRect.left - task.start);
    const updatedTask = { ...task, duration: newWidth };
    onTaskUpdate(updatedTask);
  };

  return (
    <div
      className="machine-lane"
      ref={laneRef}
      onMouseMove={e => { handleMouseMove(e); handleResizeMouseMove(e); }}
      onMouseUp={handleMouseUp}
      style={{ position: 'relative', height: '60px', borderBottom: '1px solid #ccc' }}
    >
      <div className="machine-name" style={{ position: 'absolute', left: 0, top: 0, width: '100px' }}>
        {machineName}
      </div>

      {tasks.map(task => (
        <div
          key={task.id}
          className="task"
          onMouseDown={e => handleMouseDown(e, task.id)}
          style={{
            position: 'absolute',
            left: task.start,
            top: 10,
            width: task.duration,
            height: 40,
            backgroundColor: '#3b82f6',
            cursor: 'move',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 5px',
            boxSizing: 'border-box',
            borderRadius: '4px',
          }}
        >
          <span>{task.name}</span>
          <div
            className="resize-handle"
            onMouseDown={e => handleResizeMouseDown(e, task.id)}
            style={{
              width: '6px',
              height: '100%',
              backgroundColor: 'rgba(255,255,255,0.7)',
              cursor: 'ew-resize',
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default MachineLane;