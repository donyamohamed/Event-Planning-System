import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageServiceService {

  constructor() { } 
  
  getCurrentLanguage() {
    return localStorage.getItem('Abp.Localization.CultureName');
  }

  setCurrentLanguage(language: string): void {
    localStorage.setItem('Abp.Localization.CultureName', language);
  }
}