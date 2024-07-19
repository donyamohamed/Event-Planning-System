import { Component } from '@angular/core';
import { ExpensesService } from '../../../shared/services/expenses.service';
import { AppSessionService } from '@shared/session/app-session.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: 'app-set-expenses',
  standalone: true,
  imports: [FormsModule, CommonModule, SharedModule],
  templateUrl: './set-expenses.component.html',
  styleUrls: ['./set-expenses.component.css']
})
export class SetExpensesComponent {
  newExpense: any = {};
  expenses: any[] = [];
  isUpdating: boolean = false;
  selectedExpenseId: number | null = null;
  eventId: number;
  userID: number;
  showError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private budgetExpenseService: ExpensesService,
    private appSessionService: AppSessionService
  ) {}

  ngOnInit(): void {
    this.userID = this.appSessionService.userId;
    this.route.queryParams.subscribe(params => {
      this.eventId = +params['eventId'];
      if (this.eventId) {
        this.loadExpenses();
      }
    });
  }

  loadExpenses(): void {
    this.budgetExpenseService.getExpensesByUserAndEvent(this.userID, this.eventId).subscribe(
      (response: any) => {
        console.log(response);
        this.expenses = response.result ?? [];
      },
      (error) => {
        console.error('Error loading budget expenses:', error);
      }
    );
  }

  checkAndAddExpense(): void {
    this.showError = true;

    if (!this.newExpense.name || !this.newExpense.amount || this.newExpense.amount < 0) {
      return;
    }

    this.addExpense();
  }

  addExpense(): void {
    this.newExpense.date = new Date().toISOString().split('T')[0]; // Set date to current date in YYYY-MM-DD format
    this.newExpense.userId = this.appSessionService.userId;
    this.newExpense.eventId = this.eventId;

    console.log('Payload being sent:', this.newExpense);

    this.budgetExpenseService.createBudgetExpense(this.newExpense).subscribe(
      (response: any) => {
        console.log('Budget expense added successfully:', response);

        if (response && response.result) {
          console.log(this.expenses);
          this.expenses.push(response.result);
        } else {
          console.error('Unexpected response format:', response);
        }

        this.resetForm();
      },
      (error) => {
        console.error('Error adding budget expense:', error);
      }
    );
  }

  updateExpense(expense: any): void {
    this.newExpense = { ...expense }; // Populate form with selected expense
    this.isUpdating = true;
    this.selectedExpenseId = expense.id;
  }

  confirmUpdate(): void {
    if (this.selectedExpenseId !== null) {
      if (this.newExpense.amount < 0) {
        this.showError = true;
        return;
      }

      this.budgetExpenseService.updateBudgetExpense(this.newExpense).subscribe(
        (response: any) => {
          console.log('Budget expense updated successfully:', response);

          const index = this.expenses.findIndex(expense => expense.id === this.selectedExpenseId);

          if (index !== -1) {
            this.expenses[index] = this.newExpense;
          }

          this.resetForm();
        },
        (error) => {
          console.error('Error updating budget expense:', error);
        }
      );
    }
  }

  deleteExpense(id: number): void {
    this.budgetExpenseService.deleteExpense(id).subscribe(
      () => {
        console.log('Budget expense deleted successfully');
        this.expenses = this.expenses.filter(expense => expense.id !== id);
      },
      (error) => {
        console.error('Error deleting budget expense:', error);
      }
    );
  }

  resetForm(): void {
    this.newExpense = {};
    this.isUpdating = false;
    this.selectedExpenseId = null;
    this.showError = false; // Reset error display flag
  }
}
