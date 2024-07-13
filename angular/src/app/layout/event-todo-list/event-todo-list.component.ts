import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToDoList } from '../../../shared/Models/ToDoList';
import { TodoListService } from '../../../shared/services/todo-list.service';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'; // Import SweetAlert
import { EventdetailsService } from '../../../shared/services/eventdetails.service';
import { CurrentUserDataService } from '../../../shared/services/current-user-data.service';
@Component({
  selector: 'app-event-todo-list',
  templateUrl: './event-todo-list.component.html',
  styleUrls: ['./event-todo-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TodoListComponent implements OnInit {
  todoItems: ToDoList[] = [];
  newTask: { description: string; date: string } = { description: '', date: '' };
  showStatusOptions: boolean = false;
  selectedTask: ToDoList | null = null;

  userId: number | null = null; // Store the user ID
  eventId: number | null = null; // Store the event ID
  eventEndDate: Date | null = null; // Store the end date of the event

  constructor(
    private todoListService: TodoListService, 
    private http: HttpClient, 
    private route: ActivatedRoute,
    private eventDetailsService: EventdetailsService, // Inject EventdetailsService
    private currentUserDataService: CurrentUserDataService
  ) { }

  ngOnInit(): void {
    this.getUserData();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventId = +id; // Convert string to number
        this.getToDoList(this.eventId);
        this.getEventDetails(this.eventId); // Fetch event details including end date
      } else {
        console.error('Event ID not found in the URL');
      }
    });
  }

  getUserData(): void {
    this.currentUserDataService.GetCurrentUserData().subscribe(
      (response) => {
        if (response) {
          this.userId = response.id;
          console.log('User ID fetched:', this.userId); // Debug log
        }
      },
      (error) => {
        console.error('Error fetching user data', error);
      }
    );
  }
  

  getEventDetails(eventId: number): void {
    this.eventDetailsService.getEventById(eventId).subscribe(
      (data: any) => {
        this.eventEndDate = new Date(data.result.endDate); // Convert end date string to Date object
        console.log("Event Details:", data.result);
      },
      (error) => {
        console.error('Error fetching event details:', error);
      }
    );
  }

  createToDoItem(): void {
    if (!this.newTask.description) {
      Swal.fire('Error', 'Please enter a task description.', 'error');
      return;
    }

    if (!this.newTask.date) {
      Swal.fire('Error', 'Please select a date and time.', 'error');
      return;
    }

    if (this.userId === null) {
      Swal.fire('Error', 'User ID not available.', 'error');
      return;
    }

    if (this.eventId === null) {
      Swal.fire('Error', 'Event ID not available.', 'error');
      return;
    }

    const newItem: ToDoList = {
      id: 0, // Id should be set by the backend
      status: 'Todo',
      date: new Date(this.newTask.date),
      description: this.newTask.description,
      userId: this.userId, // Use the fetched userId
      eventId: this.eventId // Use the fetched eventId
    };

    // Check if the date of the to-do item is after the event end date
    if (this.eventEndDate && newItem.date > this.eventEndDate) {
      Swal.fire('Error', 'To-do list date cannot be after the event end date.', 'error');
      return;
    }

    console.log('Creating new task:', newItem); // Debug log

    this.todoListService.createToDoCheckList(newItem).subscribe(
      (data: ToDoList) => {
        console.log('Task created successfully:', data); // Debug log
        this.todoItems.push(data);
        this.newTask = { description: '', date: '' }; // Reset the form
        window.location.reload();
      },
      (error) => {
        console.error('Error creating ToDo item', error);
      }
    );
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
        if (this.eventId !== null) {
          this.getToDoList(this.eventId);
        }
      },
      error => {
        console.error('Error deleting task:', error);
      }
    );
  }
}
