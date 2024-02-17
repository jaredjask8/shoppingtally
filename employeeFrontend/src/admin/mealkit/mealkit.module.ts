import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MealkitRoutingModule } from './mealkit-routing.module';
import { MealkitComponent } from './mealkit.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from 'src/global/components/loader.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [MealkitComponent],
  imports: [
    CommonModule,
    MealkitRoutingModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent,
    MatSnackBarModule
  ]
})
export class MealkitModule { }
