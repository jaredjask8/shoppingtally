import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AffiliateRoutingModule } from './affiliate-routing.module';
import { AffiliateComponent } from './affiliate.component';
import { LoaderComponent } from 'src/global/components/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    AffiliateComponent
  ],
  imports: [
    CommonModule,
    AffiliateRoutingModule,
    LoaderComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ]
})
export class AffiliateModule { }
