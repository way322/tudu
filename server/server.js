import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

let todos = [
  { id: 1, title: 'поиграть в доту', completed: false },
  { id: 2, title: 'делать дз', completed: true },
];


app.get('/api/todos', (req, res) => {
  res.json(todos);
});


app.get('/api/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Задача не найдена' });
  res.json(todo);
});


app.post('/api/todos', (req, res) => {
  const newTodo = {
    id: Date.now(),
    title: req.body.title,
    completed: req.body.completed || false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});


app.put('/api/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Задача не найдена' });

  todos[index] = { ...todos[index], ...req.body };
  res.json(todos[index]);
});


app.delete('/api/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id !== parseInt(req.params.id));
  res.json({ message: 'Задача удалена' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});