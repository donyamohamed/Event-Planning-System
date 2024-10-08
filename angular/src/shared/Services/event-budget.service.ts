import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EventBudgetService {

  private apiUrl = `${environment.API_URL_BASE_PART}/api/services/app/BudgetExpenseAppServices/Get`;

  constructor(private http: HttpClient) { }

  getBudgetAmountById(budgetId: number): Observable<any> {
    const url = `${this.apiUrl}?Id=${budgetId}`;
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error fetching budget amount:', error);
        return throwError(error);
      })
    );
  }
}
