import { useEffect, useState } from 'react';
import axios from 'axios'; 
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', completed: false });
  const [editTodo, setEditTodo] = useState(null);

  const API_URL = 'http://localhost:5000/api/todos';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, newTodo);
      setNewTodo({ title: '', completed: false });
      await fetchTodos();
    } catch (error) {
      console.error('Ошибка создания:', error);
    }
  };

  const handleUpdate = async (id, updatedTodo) => {
    try {
      await axios.put(`${API_URL}/${id}`, updatedTodo);
      await fetchTodos();
      setEditTodo(null);
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  // Новая функция для обновления только статуса completed
  const handleToggleComplete = async (id, currentCompleted) => {
    try {
      await axios.put(`${API_URL}/${id}`, { completed: !currentCompleted });
      await fetchTodos();
      // Не сбрасываем editTodo, если мы в режиме редактирования этой задачи
      if (editTodo && editTodo.id === id) {
        setEditTodo(prev => prev ? { ...prev, completed: !currentCompleted } : null);
      }
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchTodos();
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  return (
    <div className="App">
      <h1 className='zagalovok'>Менеджер задач</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          placeholder="Новая задача"
          required
          className='input'
        />
        <button type="submit" className='button1'>Добавить</button>
      </form>

      <div className="todos-list">
        {todos.map((todo) => (
          <div key={todo.id} className={`todo-item ${editTodo?.id === todo.id ? 'editing' : ''}`}>
            {editTodo?.id === todo.id ? (
              <input
                className='inizmen'
                value={editTodo.title}
                onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })}
                style={{
                  textDecoration: editTodo.completed ? 'line-through' : 'none',
                }}
              />
            ) : (
              <span 
                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }} 
                className='text'
              >
                {todo.title}
              </span>
            )}

            <div className="actions">
              <input
                type="checkbox"
                className='check'
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id, todo.completed)}
              />
              {editTodo?.id === todo.id ? (
                <button
                  className='knopka'
                  onClick={() => handleUpdate(todo.id, editTodo)}
                >
                  Сохранить
                </button>
              ) : (
                <button
                  className='knopka'
                  onClick={() => setEditTodo(todo)}
                >
                  Редактировать
                </button>
              )}
              <button
                className='knopka'
                onClick={() => handleDelete(todo.id)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;