import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { ListComponent } from './list.component';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { DatepickerComponent } from 'src/global/bootstrap-components/datepicker/datepicker.component';
import { MatStepperModule } from '@angular/material/stepper';
import {MatDividerModule} from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import { ButtonsComponent } from 'src/global/components/buttons/buttons.component';


@NgModule({
  declarations: [
    ListComponent
    
  ],
  imports: [
    CommonModule,
    ListRoutingModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    DatepickerComponent,
    MatStepperModule,
    MatDividerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatRippleModule,
    ButtonsComponent
  ],
  
})
export class ListModule { }
