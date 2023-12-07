import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MealkitRoutingModule } from './mealkit-routing.module';
import { MealkitComponent } from './mealkit.component';
import { IngredientComponent } from './ingredient/ingredient.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [MealkitComponent],
  imports: [
    CommonModule,
    MealkitRoutingModule,
    MatInputModule,
    IngredientComponent,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MealkitModule { }
