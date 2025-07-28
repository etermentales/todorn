import { useState, useEffect} from 'react';
import type { FC, FormEvent, ChangeEvent} from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://127.0.0.1:8000'

const App : FC = () => {

  interface Todo{
    id: number;
    item: string;
  }

  const [todos, setTodos] = useState<Todo[]>([])
  const [newItem, setNewItem] = useState<string>('')

  useEffect(() => {
    axios.get<Todo[]>(`${API_URL}/todos`)
      .then(response => {
        setTodos(response.data)
      }).catch(error => {
        console.error("There was an error fetching the todos!", error)
      })
  }, [])

  const handleSubmit = (event : FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    if (!newItem) return; 

    const newTodo = {
      id: Date.now(), 
      item: newItem
    };

    axios.post(`${API_URL}/todos`, newTodo)
      .then(response => {
        setTodos(response.data); 
        setNewItem('');
      })
      .catch(error => {
        console.error("There was an error adding the todo!", error);
      });
  };


  return (
    <div className='app'>
      <header className='app-header'>
        <h1>TODORN</h1>
        <form onSubmit={handleSubmit}>
          <input 
          type="text" 
          value={newItem} 
          onChange={(e : ChangeEvent<HTMLInputElement>) => setNewItem(e.target.value)} 
          placeholder='Add a todo' 
          />
          <button type="submit">Add</button>
        </form>
        <ul>
          {todos.map(todo => (
            <li key={todo.id}>{todo.item}</li>
          ))}
        </ul>
      </header>
    </div>
  )
}

export default App