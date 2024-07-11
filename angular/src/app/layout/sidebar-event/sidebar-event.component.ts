import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedModule } from "../../../shared/shared.module";

@Component({
    selector: 'app-sidebar-event',
    standalone: true,
    templateUrl: './sidebar-event.component.html',
    styleUrl: './sidebar-event.component.css',
    imports: [RouterLink, SharedModule]
})
export class SidebarEventComponent {

}
