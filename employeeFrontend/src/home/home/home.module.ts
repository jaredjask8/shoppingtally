import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { MatDividerModule } from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    MatCardModule
  ]
})
export class HomeModule { }
