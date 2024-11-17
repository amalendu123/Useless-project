import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Todo = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('https://useless-project-klib.onrender.com/todo/');
        setTasks(response.data.todos || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    console.log("hello")
    fetchTasks();
  },[]);

  const handleSubmit = async () => {
    if (task.trim() === '') {
      console.log("error");
      return;
    }

    try {
      const newTask = {
        text: task,
        date: selectedDate || new Date().toISOString().split('T')[0],
        completed: false,
      };

      const response = await axios.post('https://useless-project-klib.onrender.com/todo/create/', newTask);
      setTasks([...tasks, newTask]); 
      setTask('');
      setSelectedDate('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`https://useless-project-klib.onrender.com/todo/delete/${taskId}/`);
      setTasks(tasks.filter((t) => t.id !== taskId));  
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const groupedTasks = tasks.reduce((groups, task) => {
    const date = task.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {});

  return (
    <div className="h-screen w-screen flex flex-col items-center p-8 mb-20">
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Enter the task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
        />
        <button 
          className="md:w-40 w-20 h-12 bg-red-700 rounded-xl text-white hover:bg-red-800 transition-colors"
          onClick={handleSubmit}
        >
          Add
        </button>
      </div>
      
      <div className="w-full max-w-md">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks added yet</p>
        ) : (
          Object.entries(groupedTasks)
            .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
            .map(([date, dateTasks]) => (
              <div key={date} className="mb-6">
                <h2 className="text-lg font-semibold mb-3 text-red-600">
                  {formatDate(date)}
                </h2>
                {dateTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center gap-4 p-4 mb-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                      onChange={() => handleDelete(task.id)}
                    />
                    <div className="flex-1">
                      <span className="text-black">{task.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Todo;
