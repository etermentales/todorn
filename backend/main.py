# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

origins = [
    "http://localhost:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # TODO: Change this back to origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Todo(BaseModel):
    id: int
    item: str

todo_list = [
    Todo(id=1, item="Learn FastAPI"),
    Todo(id=2, item="Build a React frontend"),
]


@app.get("/")
def read_root():
    return {"message": "Welcome to the To-Do List API!"}

@app.get("/todos", response_model=List[Todo])
def get_todos():
    """Returns the entire list of to-dos."""
    return todo_list

@app.post("/todos", response_model=List[Todo])
def add_todo(todo: Todo):
    """Adds a new to-do item to the list."""
    todo_list.append(todo)
    return todo_list