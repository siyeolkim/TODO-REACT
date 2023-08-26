import React, { useState, useEffect } from 'react';
import './App.css';


type Todo = {
  text: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt?: string;
};

const TodoApp = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // useEffect(() => {
  //   const savedTodos = localStorage.getItem('todos');
  //   if (savedTodos) {
  //     setTodos(JSON.parse(savedTodos));
  //   }
  // }, []);

  const savedTodosFromLocalStorage = localStorage.getItem('todos');
  const initialTodos = savedTodosFromLocalStorage ? JSON.parse(savedTodosFromLocalStorage) : [];

  const [todos, setTodos] = useState<Todo[]>(initialTodos);


  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    const newTodo: Todo = {
      text: inputValue,
      isCompleted: false,
      createdAt: new Date().toLocaleString(),
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const handleUpdateTodo = (index: number, updatedTodo: Todo) => {
    const newTodos = [...todos];
    newTodos[index] = updatedTodo;
    setTodos(newTodos);
    setEditingIndex(null);
  };

  const handleDeleteTodo = (index: number) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  return (
    <div>
      <h1>TODO-LIST</h1>
      <input 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)} 
        onKeyPress={(e) => {
          if (e.key === 'Enter' && inputValue.trim()) {
            handleAddTodo();
          }
        }}
      />
      <button onClick={handleAddTodo}>추가</button>

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {editingIndex === index ? (
              <>
                <input 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && editValue.trim()) {
                      const updatedTodo = { ...todo, text: editValue, updatedAt: new Date().toLocaleString() };
                      handleUpdateTodo(index, updatedTodo);
                    }
                  }}
                />
              </>
            ) : (
              <>
                {todo.isCompleted ? <s>{todo.text}</s> : todo.text} ({todo.createdAt}{todo.updatedAt && `, 수정: ${todo.updatedAt}`})
                
                <button onClick={() => {
                  const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
                  handleUpdateTodo(index, updatedTodo);
                }}>{todo.isCompleted ? '복원' : '완료'}</button>

                <button onClick={() => handleDeleteTodo(index)}>삭제</button>

                <button onClick={() => {
                  setEditingIndex(index);
                  setEditValue(todo.text);
                }}>수정</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;

