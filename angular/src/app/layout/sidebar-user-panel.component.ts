import {
  Component,
  ChangeDetectionStrategy,
  Injector,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CurrentUser } from '@shared/Models/current-user';
import { CurrentUserDataService } from '@shared/Services/current-user-data.service';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'sidebar-user-panel',
  templateUrl: './sidebar-user-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarUserPanelComponent extends AppComponentBase implements OnInit {
  shownLoginName = '';
  UserName = '';
  user: CurrentUser | null = null;

  constructor(
    injector: Injector,
    public serv: CurrentUserDataService,
    private cdr: ChangeDetectorRef 
  ) {
    super(injector);
  }

  ngOnInit() {
    this.shownLoginName = this.appSession.getShownLoginName();
    this.serv.GetCurrentUserData().subscribe({
      next: us => {
        this.user = us;
        this.UserName = this.user.userName;
        this.cdr.markForCheck();
      }
    });
  }
  getUserImage(): string {
    return this.user?.image ? `https://localhost:44311/${this.user.image}` : 'assets/img/user.jpg';
  }
}
