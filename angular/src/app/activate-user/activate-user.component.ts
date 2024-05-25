import { Component, OnInit,Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveAccountService } from '@shared/Services/active-account.service';
@Component({
  selector: 'app-activate-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activate-user.component.html',
  styleUrl: './activate-user.component.css'
})
export class ActivateUserComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private activeAccountService: ActiveAccountService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {

    this.renderer.removeClass(document.body, 'login-page');
    this.activateAccount();
  }

  activateAccount(): void {

    const id = this.route.snapshot.params['id'];

  
    this.activeAccountService.activeAccount({ id }).subscribe(
      (response) => {
       
        console.log('Account activated successfully:', response);
    
        this.router.navigate(['/account/login']);
      },
      (error) => {
        
        console.error('Error activating account:', error);
  
      }
    );
  }
}
