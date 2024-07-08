import { Component, OnInit,Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveAccountService } from '@shared/services/active-account.service';
import { NotifyService } from 'abp-ng2-module';
import { SharedModule } from "../../shared/shared.module";

@Component({
    selector: 'app-activate-user',
    standalone: true,
    templateUrl: './activate-user.component.html',
    styleUrl: './activate-user.component.css',
    imports: [CommonModule, SharedModule]
})
export class ActivateUserComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activeAccountService: ActiveAccountService,
    private renderer: Renderer2,
    private notify:NotifyService
  ) {}

  ngOnInit(): void {

    this.renderer.removeClass(document.body, 'login-page');
  
  }

  activateAccount(): void {

    const id = this.route.snapshot.params['id'];

  
    this.activeAccountService.activeAccount({ id }).subscribe(
      (response) => {
       
        console.log('Account activated successfully:', response);
    
        this.notify.success('Your Account Activated  successful!');
        
        // Close the window after a short delay
        setTimeout(() => {
          window.close();
        }, 3000); // Adjust the delay as needed
      },
      (error) => {
        
        console.error('Error activating account:', error);
  
      }
    );
  }
}
