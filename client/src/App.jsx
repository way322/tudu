import { useEffect, useState } from 'react';
import axios from 'axios'; 
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', completed: false });
  const [editTodo, setEditTodo] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
    if (!newTodo.title.trim()) return;
    
    setIsAdding(true);
    try {
      await axios.post(API_URL, newTodo);
      setNewTodo({ title: '', completed: false });
      await fetchTodos();
    } catch (error) {
      console.error('Ошибка создания:', error);
    } finally {
      setIsAdding(false);
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

  const handleToggleComplete = async (id, currentCompleted) => {
    try {
      await axios.put(`${API_URL}/${id}`, { completed: !currentCompleted });
      await fetchTodos();
      if (editTodo && editTodo.id === id) {
        setEditTodo(prev => prev ? { ...prev, completed: !currentCompleted } : null);
      }
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTimeout(() => {
        fetchTodos();
        setDeletingId(null);
      }, 300);
    } catch (error) {
      console.error('Ошибка удаления:', error);
      setDeletingId(null);
    }
  };

  // Статистика
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const progressPercentage = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  return (
    <div className="App">
      <h1 className='zagalovok'>Менеджер задач</h1>

      {/* Статистика */}
      <div className="stats-container">
        <div className="stats-card">
          <div className="stat">
            <span className="stat-number">{totalTodos}</span>
            <span className="stat-label">Всего задач</span>
          </div>
          <div className="stat">
            <span className="stat-number">{completedTodos}</span>
            <span className="stat-label">Выполнено</span>
          </div>
          <div className="stat">
            <span className="stat-number">{Math.round(progressPercentage)}%</span>
            <span className="stat-label">Прогресс</span>
          </div>
        </div>
        
        {/* Прогресс бар */}
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={isAdding ? 'adding' : ''}>
        <input
          type="text"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          placeholder="Новая задача..."
          required
          className='input'
        />
        <button type="submit" className='button1' disabled={isAdding}>
          {isAdding ? '✓' : 'Добавить'}
        </button>
      </form>

      <div className="todos-list">
        {todos.map((todo) => (
          <div 
            key={todo.id} 
            className={`todo-item ${editTodo?.id === todo.id ? 'editing' : ''} ${
              deletingId === todo.id ? 'deleting' : ''
            }`}
          >
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
                  className='knopka save-btn'
                  onClick={() => handleUpdate(todo.id, editTodo)}
                >
                  Сохранить
                </button>
              ) : (
                <button
                  className='knopka edit-btn'
                  onClick={() => setEditTodo(todo)}
                >
                  Редактировать
                </button>
              )}
              <button
                className='knopka delete-btn'
                onClick={() => handleDelete(todo.id)}
                disabled={deletingId === todo.id}
              >
                {deletingId === todo.id ? '...' : 'Удалить'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;