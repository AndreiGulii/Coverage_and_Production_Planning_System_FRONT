// src/components/TaskItem.tsx
import React, { useState, useRef } from 'react';
import type { Task } from '../types/types';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate }) => {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const taskRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragging(true);
    const rect = taskRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset(e.clientX - rect.left);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && taskRef.current) {
      const parentRect = taskRef.current.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

      const newStart = Math.max(0, e.clientX - parentRect.left - dragOffset);
      onUpdate({ ...task, start: newStart });
    } else if (resizing && taskRef.current) {
      const parentRect = taskRef.current.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

      const newDuration = Math.max(20, e.clientX - parentRect.left - task.start);
      onUpdate({ ...task, duration: newDuration });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizing(true);
  };

  return (
    <div
      ref={taskRef}
      className="task-item"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: 'absolute',
        left: task.start,
        width: task.duration,
        top: 10,
        height: 40,
        backgroundColor: '#3b82f6',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 5px',
        boxSizing: 'border-box',
        borderRadius: '4px',
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
    >
      <span>{task.name}</span>
      <div
        className="resize-handle"
        onMouseDown={handleResizeMouseDown}
        style={{
          width: 6,
          height: '100%',
          backgroundColor: 'rgba(255,255,255,0.7)',
          cursor: 'ew-resize',
        }}
      />
    </div>
  );
};

export default TaskItem;