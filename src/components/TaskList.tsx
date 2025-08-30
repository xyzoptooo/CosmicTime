import React, { useState } from 'react';
import TaskItem from './TaskItem';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleAddTask = () => {
    if (inputValue.trim() === '') return;
    const newTask: Task = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="p-4 bg-gray-800 bg-opacity-50 rounded-lg text-white">
      <h2 className="text-xl mb-4">Tasks</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleAddTask()}
          className="bg-gray-700 text-white rounded-l-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Add a new task..."
        />
        <button
          onClick={handleAddTask}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-r-md"
        >
          Add
        </button>
      </div>
      <div>
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;