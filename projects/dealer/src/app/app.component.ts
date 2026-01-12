import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dealer';
  isSidemenuLocked = false;
  authRoute = false;

  get containerClass() {
    return {
      'layout-theme-light': true,
      'layout-overlay': false,
      'layout-static': true,
      'layout-static-inactive': false,
      'layout-overlay-active': false,
      'layout-mobile-active': false
    };
  }
}
