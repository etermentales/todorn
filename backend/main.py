from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

origins = [
    "http://localhost:5173", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Todo(BaseModel):
    id: int
    item: str

todos = {}


@app.get("/")
def read_root():
    return {"message": "Welcome to the To-Do List API!"}

@app.get("/todos", response_model=List[Todo])
def get_todos():
    """Returns the entire list of to-dos."""
    return list(todos.values())

@app.post("/todos", response_model=Todo)
def add_todo(todo: Todo):
    """Adds a new to-do item to the list."""
    todos[todo.id] = todo
    return todo

@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, todo: Todo):
    """Updates a to-do item from the list."""
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="Todo not found")
    if todo_id != todo.id:
        raise HTTPException(status_code=400, detail='Id mismatch')
    todos[todo_id] = todo
    return todos[todo_id]
    
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    """Deletes a to-do item from the list."""
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="Todo not found")
    del todos[todo_id]

