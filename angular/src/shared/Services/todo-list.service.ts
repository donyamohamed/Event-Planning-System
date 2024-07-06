import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToDoList } from '../Models/ToDoList';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  private apiUrl = `${environment.API_URL_BASE_PART}/api/services/app/ToDoCheckList`;

  constructor(private http: HttpClient) { }

  createToDoCheckList(item: ToDoList): Observable<ToDoList> {
    const url = `${this.apiUrl}/Create`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<ToDoList>(url, item, { headers });
  }

  getToDoCheckList(eventId: number): Observable<ToDoList[]> {
    const url = `${this.apiUrl}/GetToListEvent?eventId=${eventId}`;
    return this.http.get<ToDoList[]>(url);
  }

  updateToDoList(task: ToDoList): Observable<ToDoList> {
    const url = `${this.apiUrl}/Update`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<ToDoList>(url, task, { headers });
  }
  
  deleteTask(taskId: number): Observable<any> {
    const url = `${this.apiUrl}/Delete?Id=${taskId}`;
    return this.http.delete(url);
  }
}
