import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToDoList } from '../../../shared/Models/ToDoList';
import { TodoListService } from '../../../shared/Services/todo-list.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-todo-list',
  templateUrl: './event-todo-list.component.html',
  styleUrls: ['./event-todo-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule]
})
export class TodoListComponent implements OnInit {
  todoItems: ToDoList[] = [];
  newTask: { description: string; date: string } = { description: '', date: '' };
  showStatusOptions: boolean = false;
  taskDescription: string = ''; // Initialize with empty string
  taskDate: string = '';
  selectedTask: ToDoList | null = null;
  
  constructor(private todoListService: TodoListService) { }

  ngOnInit(): void {
    this.getToDoList(5); // Example eventId
    
  }

  

  createToDoItem(): void {
    if (!this.newTask.description) {
      alert('Please enter a task description.');
      return;
    }

    if (!this.newTask.date) {
      alert('Please select a date and time.');
      return;
    }

    const newItem: ToDoList = {
      id: 0, // Id should be set by the backend
      status: 'Todo',
      date: new Date(this.newTask.date),
      description: this.newTask.description,
      userId: 1, // Example userId
      eventId: 5 // Example eventId
    };

    this.todoListService.createToDoCheckList(newItem).subscribe(
      (data: ToDoList) => {
        this.todoItems.push(data);
        this.newTask = { description: '', date: '' }; // Reset the form
      },
      (error) => {
        console.error('Error creating ToDo item', error);
      }
      
    );
    window.location.reload();

  }
  getToDoList(eventId: number): void {
    this.todoListService.getToDoCheckList(eventId).subscribe(
      (response: any) => {
        if (response.success && Array.isArray(response.result)) {
          this.todoItems = response.result;
          console.log('Fetched todo items:', this.todoItems);
        } else {
          console.error('Error fetching ToDo list:', response.error);
        }
      },
      (error) => {
        console.error('Error fetching ToDo list:', error);
      }
    );
  }

  getTaskColor(status: string): string {
    if (!status) {
      return 'bg-secondary'; 
    }
  
    switch (status.toLowerCase()) {
      case 'todo':
        return 'bg-todo';
      case 'inprogress':
        return 'bg-warning';
      case 'done':
        return 'bg-success';
      default:
        return 'bg-secondary'; 
    }
  }
  

  isTaskOverdue(task: ToDoList): boolean {
    const taskDate: Date = new Date(task.date);
    const currentDate: Date = new Date();
    return taskDate < currentDate && (task.status.toLowerCase() === 'todo' || task.status.toLowerCase() === 'inprogress');
  }
  

  updateTaskStatus(taskToUpdate: ToDoList, newStatus: string): void {
    
    taskToUpdate.status = newStatus;
    
    this.todoListService.updateToDoList(taskToUpdate).subscribe(
      (updatedTask: ToDoList) => {
        console.log('Task status updated successfully:', updatedTask);
        
        this.selectedTask = null; // Reset the selected task after updating status
      },
      (error) => {
        console.error('Error updating task status:', error);
        // Handle error
      }
    );
  }
  
    toggleTaskSelection(task: ToDoList): void {
      if (this.selectedTask === task) {
        this.selectedTask = null; 
      } else {
        this.selectedTask = task; 
      }
    }
    deleteTask(taskId: number): void {
      this.todoListService.deleteTask(taskId).subscribe(
        () => {
          console.log('Task deleted successfully');
          // Reload the todo list after deletion
          this.getToDoList(5);
        },
        error => {
          console.error('Error deleting task:', error);
        }
      );
    }
    
}
