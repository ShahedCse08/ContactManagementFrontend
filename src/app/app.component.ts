import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DatavancedAssessment';
  isCollapsed = false; 


  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed; // Toggle collapse
  }

}
