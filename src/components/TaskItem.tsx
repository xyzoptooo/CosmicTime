import React from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, toggleTask, deleteTask }) => {
  return (
    <div className={`flex items-center justify-between p-2 rounded-md mb-2 ${task.completed ? 'bg-gray-700' : 'bg-gray-600'}`}>
      <span
        className={`flex-grow cursor-pointer ${task.completed ? 'line-through text-gray-400' : ''}`}
        onClick={() => toggleTask(task.id)}
      >
        {task.text}
      </span>
      <button
        onClick={() => deleteTask(task.id)}
        className="text-red-500 hover:text-red-700 ml-4"
      >
        Delete
      </button>
    </div>
  );
};

export default TaskItem;