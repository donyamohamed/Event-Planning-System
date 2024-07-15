import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'], // Fixed typo here
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class SearchComponent {
  @Input() data: any[] = [];
  @Output() searchResults = new EventEmitter<any[]>();
  searchQuery: string = '';

  constructor() { }

  ngOnInit(): void { }

  onSearch(): void {
    const filteredData = this.searchQuery === '' ? this.data : this.data.filter(item =>
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.searchResults.emit(filteredData);
  }
}
