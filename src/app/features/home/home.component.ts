import { Component } from '@angular/core';

import {MatDividerModule} from '@angular/material/divider'; 
import {MatButtonModule} from '@angular/material/button'; 
import {MatMenuModule} from '@angular/material/menu'; 
import {MatIconModule} from '@angular/material/icon';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatDividerModule,MatButtonModule,MatMenuModule,MatIconModule,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{

  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
   
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    
  }

}
