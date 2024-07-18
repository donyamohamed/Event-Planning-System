import { Component, OnInit } from '@angular/core';
import { Expenses } from './../../../shared/Models/expenses';
import { SidebarEventComponent } from '../../layout/sidebar-event/sidebar-event.component';
import { CommonModule } from '@angular/common';
import { ExpensesService } from '../../../shared/services/expenses.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-expenses-report',
  standalone: true,
  imports: [SidebarEventComponent, CommonModule],
  templateUrl: './expenses-report.component.html',
  styleUrl: './expenses-report.component.css'
})
export class ExpensesReportComponent implements OnInit {
  items: { [key: string]: Expenses[] } = {};

  constructor(private expenseServ: ExpensesService) {}

  ngOnInit(): void {
    this.expenseServ.reportExpense().subscribe({
      next: (data) => {
        console.log('Data received from API:', data); // Log the data received
        const transformedData = this.transformExpenses(data.result);
        this.items = transformedData; // Correctly access the nested result property
        console.log(this.items);
      },
      error: (err) => {
        console.error('Error fetching expenses:', err);
      }
    });
  }

  transformExpenses(expenses: Expenses[]): { [key: string]: Expenses[] } {
    // Assuming the data already comes grouped by event names
    const transformedData: { [key: string]: Expenses[] } = {};

    Object.keys(expenses).forEach(eventName => {
      const expensesArray = expenses[eventName];
      // Ensure expensesArray is an array before attempting to push items
      if (Array.isArray(expensesArray)) {
        transformedData[eventName] = expensesArray;
      } else {
        console.warn(`Skipping non-array value for event name '${eventName}'`);
      }
    });

    return transformedData;
  }

  totalamount(eventName: string): number {
    let total = 0;
    this.items[eventName].forEach((item) => {
      total += item.amount;
    });
    return total;
  }

  saveAsExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.prepareTableData());
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
    XLSX.writeFile(wb, 'Expenses_Report.xlsx');
  }

 
    saveAsPdf(): void {
      const doc = new jsPDF();
      const tableElement = document.querySelector('table') as HTMLTableElement;
      if (tableElement) {
        (doc as any).autoTable({ html: tableElement });
        doc.save('Expenses_Report.pdf');
      }
    }
  
  

  // print(): void {
  //   window.print();
  // }
  print(): void {
    const tableElement = document.querySelector('table') as HTMLTableElement;
    if (tableElement) {
      const newWin = window.open('', '', 'width=800,height=600');
      if (newWin) {
        newWin.document.write(`
          <html>
            <head>
              <title>Print Table</title>
              <style>
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                table, th, td {
                  border: 1px solid black;
                }
                th, td {
                  padding: 8px;
                  text-align: left;
                }
                .table-primary {
                  background-color: #f2f2f2;
                }
              </style>
            </head>
            <body>
              ${tableElement.outerHTML}
            </body>
          </html>
        `);
        newWin.document.close();
        newWin.print();
        //newWin.close();
      }
    }
  }
  
  private prepareTableData(): any[] {
    const tableData: any[] = [];
    Object.keys(this.items).forEach(eventName => {
      const expenses = this.items[eventName];
      expenses.forEach((expense, index) => {
        const rowData = {
          'Event Name': index === 0 ? eventName : '',
          'Expense Name': expense.name,
          'Amount': expense.amount,
          'Date': new Date(expense.date).toLocaleDateString()
        };
        tableData.push(rowData);
      });
      tableData.push({
        'Event Name': eventName,
        'Expense Name': 'there is no Expense',
        'Amount': this.totalamount(eventName),
        'Date': ''
      });
    });
    return tableData;
  }
}
