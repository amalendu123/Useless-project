import React, { useState, useEffect } from 'react';

const Pomodoro = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleSubmit = () => {
    if (task.trim() === '') {
      console.log("error");
      return;
    }
    setTasks([...tasks, { id: Date.now(), text: task, completed: false }]);
    setTask(''); 
  };

  const handleDelete = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center p-8 bg-white">
      <div className="mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Enter the task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button 
          className="w-40 h-12 bg-red-700 rounded-xl text-white hover:bg-red-800 transition-colors"
          onClick={handleSubmit}
        >
          Add
        </button>
      </div>
      
      <div className="w-full max-w-md">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks added yet</p>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id}
              className="flex items-center gap-4 p-4 mb-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <input
                type="checkbox"
                className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                onChange={() => handleDelete(task.id)}
              />
              <span className="flex-1">{task.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Pomodoro;