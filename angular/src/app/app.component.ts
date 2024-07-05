import { Component, Injector, OnInit, Renderer2 } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { SignalRAspNetCoreHelper } from '@shared/helpers/SignalRAspNetCoreHelper';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import {LocalStorageServiceService} from './../shared/Services/local-storage-service.service';

@Component({
  templateUrl: './app.component.html'
})
export class AppComponent extends AppComponentBase implements OnInit {
  sidebarExpanded: boolean;
  currentLanguage: string;


  
  constructor(
    private localStorageService: LocalStorageServiceService,
    injector: Injector,
    private renderer: Renderer2,
    private _layoutStore: LayoutStoreService
  ) {
    super(injector);
  }

  ngOnInit(): void {
   
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    console.log("Current Language from AppComponent:", this.currentLanguage);
    this.renderer.addClass(document.body, 'sidebar-mini');
    
    SignalRAspNetCoreHelper.initSignalR();
    
    abp.event.on('abp.notifications.received', (userNotification) => {
      abp.notifications.showUiNotifyForUserNotification(userNotification);
      
      // Desktop notification
      Push.create('AbpZeroTemplate', {
        body: userNotification.notification.data.message,
        icon: abp.appPath + 'assets/app-logo-small.png',
        timeout: 6000,
        onClick: function () {
          window.focus();
          this.close();
        }
      });
    });
    
    this._layoutStore.sidebarExpanded.subscribe((value) => {
      this.sidebarExpanded = value;
    });
   
  }
  

  
  toggleSidebar(): void {
    this._layoutStore.setSidebarExpanded(!this.sidebarExpanded);
  }
  
  
  
}
