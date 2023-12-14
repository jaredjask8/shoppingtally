import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MealkitRoutingModule } from './mealkit-routing.module';
import { MealkitComponent } from './mealkit.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    MealkitComponent
  ],
  imports: [
    CommonModule,
    MealkitRoutingModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class MealkitModule { }
