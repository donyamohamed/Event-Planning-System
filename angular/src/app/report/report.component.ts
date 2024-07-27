import { CommonModule } from '@angular/common';

import { ExpensesService } from '../../shared/services/expenses.service';

import { result } from "lodash-es";
import { Component, OnInit, AfterViewInit } from "@angular/core";

import { HistoryeventService } from "../../shared/services/historyevent.service";

import { SidebarEventComponent } from "../layout/sidebar-event/sidebar-event.component";
import { Chart, registerables, ChartType } from "chart.js";
import { Event } from "../../shared/Models/Event";
import { Expenses } from '@shared/Models/expenses';
import { RouterLink } from '@angular/router';

@Component({
  selector: "app-report",
  standalone: true,
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.css"],
  imports: [SidebarEventComponent,CommonModule,RouterLink],
})
export class ReportComponent implements OnInit {
  historyevent: Event[] = [];
  eventsNames: string[] = [];
  eventsData: number[] = [];
 items: { [key: string]: Expenses[] } = {}; 

  constructor(private historyeventService: HistoryeventService, private expenseServ:ExpensesService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.historyeventService.getEventNamesAndEventRating().subscribe(
      (data) => {
        console.log(data.result.eventNames);
        this.eventsNames = data.result.eventNames;
        console.log(data.result.eventRatings);
        this.eventsData = data.result.eventRatings;
        this.drawCharts(this.eventsNames, this.eventsData);
      },
      (error) => {
        console.error("Error fetching history event", error);
      }
    );
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
  totalamount(eventNaame:string){
    let total = 0;
    this.items[eventNaame].forEach((item) => {
      total += item.amount;
    })
    return total;
  }
  drawCharts(Names: string[], Data: number[]) {
    const labels = Names;
    const data = {
      labels: labels,
      datasets: [
        {
          label: "Average Rate",
          data: Data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            // 'rgba(75, 192, 192, 0.2)',
            // 'rgba(54, 162, 235, 0.2)',
            // 'rgba(153, 102, 255, 0.2)',
            // 'rgba(201, 203, 207, 0.2)',
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            // 'rgb(75, 192, 192)',
            // 'rgb(54, 162, 235)',
            // 'rgb(153, 102, 255)',
            // 'rgb(201, 203, 207)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const config = {
      type: "bar" as ChartType, // Explicitly set the type
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    const chartElement = document.getElementById(
      "barChart"
    ) as HTMLCanvasElement;
    new Chart(chartElement, config);
  }
}
