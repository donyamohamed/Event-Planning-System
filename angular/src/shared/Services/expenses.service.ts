import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expenses } from '../Models/expenses';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
    private apiUrl = ' https://localhost:44311/api/services/app/BudgetExpenseAppServices';
 
  constructor(private http:HttpClient) { }
  getAllExpenses(): Observable<any[]> {
    return this.http.get<Expenses[]>(`${this.apiUrl}/GetAll`);
  }
  getExpensesByUserAndEvent(userId: number, eventId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetExpensesByUserAndEvent?userId=${userId}&eventId=${eventId}`);
  }
  createBudgetExpense(expense: Expenses): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Create`, expense);
  }

  updateBudgetExpense(expense: Expenses): Observable<any> {
    return this.http.put<Expenses>(`${this.apiUrl}/Update`, expense);
  }
  deleteExpense(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Delete?id=${id}`);
  }


}


// hello asma