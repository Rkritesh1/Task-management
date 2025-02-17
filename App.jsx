import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Pending',
    due_date: ''
  });

  const [editTask, setEditTask] = useState(null); // Track task being edited

  // Fetch tasks on component mount
  useEffect(() => {
    axios.get(API_URL)
      .then(res => setTasks(res.data))
      .catch(err => console.error('Error fetching tasks:', err));
  }, []);

  // Add a new task
  const addTask = () => {
    if (!newTask.title || !newTask.description) {
      alert('Title and Description are required!');
      return;
    }

    axios.post(API_URL, newTask)
      .then(res => {
        setTasks([...tasks, res.data]);  // Add the newly created task to the state
        setNewTask({ title: '', description: '', status: 'Pending', due_date: '' });  // Clear form after adding task
      })
      .catch(err => {
        console.error('Error adding task:', err);
        alert('Error adding task. Please try again!');
      });
  };

  // Update an existing task
  const updateTask = (id, updatedTask) => {
    axios.put(`${API_URL}/${id}`, updatedTask)
      .then(() => {
        setTasks(tasks.map(task => (task._id === id ? updatedTask : task)));
        setEditTask(null); // Reset editTask after updating
      })
      .catch(err => console.error('Error updating task:', err));
  };

  // Delete a task
  const deleteTask = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
      })
      .catch(err => {
        console.error('Error deleting task:', err);
        alert('Error deleting task. Please try again!');
      });
  };
  

  // Handle change in input fields for editing
  const handleEditChange = (e, field) => {
    setEditTask({ ...editTask, [field]: e.target.value });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Task Management System</h1>

      {/* Task Form */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <input
          type="date"
          className="form-control mb-2"
          placeholder="Due Date"
          value={newTask.due_date}
          onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
        />
        <button className="btn btn-primary w-100" onClick={addTask}>Add Task</button>
      </div>

      {/* Tasks Table */}
      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task._id}>
              <td>{editTask && editTask._id === task._id ? (
                <input
                  type="text"
                  className="form-control"
                  value={editTask.title}
                  onChange={(e) => handleEditChange(e, 'title')}
                />
              ) : (
                task.title
              )}</td>

              <td>{editTask && editTask._id === task._id ? (
                <textarea
                  className="form-control"
                  value={editTask.description}
                  onChange={(e) => handleEditChange(e, 'description')}
                />
              ) : (
                task.description
              )}</td>

              <td>
                {editTask && editTask._id === task._id ? (
                  <select
                    className="form-control"
                    value={editTask.status}
                    onChange={(e) => handleEditChange(e, 'status')}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : (
                  task.status
                )}
              </td>

              <td>{editTask && editTask._id === task._id ? (
                <input
                  type="date"
                  className="form-control"
                  value={editTask.due_date}
                  onChange={(e) => handleEditChange(e, 'due_date')}
                />
              ) : (
                task.due_date
              )}</td>

              <td>
                {editTask && editTask._id === task._id ? (
                  <button className="btn btn-success" onClick={() => updateTask(task._id, editTask)}>Save</button>
                ) : (
                  <button className="btn btn-warning" onClick={() => setEditTask(task)}>Edit</button>
                )}
                <button className="btn btn-danger ml-2" onClick={() => deleteTask(task._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
