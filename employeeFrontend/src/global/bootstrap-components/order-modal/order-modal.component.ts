import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgbActiveModal, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { NavService } from 'src/global/nav/nav.service';
import { ListService } from 'src/list/list_component/list.service';
import { ListItem } from 'src/list/models/ListItem';
import { ListToDB } from 'src/list/models/ListToDB';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { MatDividerModule } from '@angular/material/divider';
import { DatepickerService } from '../datepicker/datepicker.service';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { ViewEncapsulation } from '@angular/compiler';
import { StepperComponent } from 'src/global/ng-material-components/stepper/stepper.component';
import { EditListComponent } from '../edit-list/edit-list.component';

@Component({
  selector: 'app-order-modal',
  templateUrl: './order-modal.component.html',
  styleUrls: ['./order-modal.component.css'],
  standalone:true,
  imports:[
    CommonModule,
    MatStepperModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    DatepickerComponent,
    MatDividerModule,
    StepperComponent,
    EditListComponent
  ],
  providers:[
    NgbActiveModal
  ]
})
export class OrderModalComponent implements OnInit{

  @ViewChild("content") content;


  constructor(private orderModal:NgbActiveModal, private navService:NavService, private modal:NgbModal, private listService:ListService, private userService:EnvironmentService){}
  
  ngOnInit(): void {
    this.navService.cartClicked$.subscribe(d => {
      if(d == true){
        this.orderModal = this.modal.open(this.content, { backdropClass: 'light-blue-backdrop', size: 'lg'})
      }
    })

    this.userService.userLoggedIn$.subscribe(d=>{
      if(!d){this.orderModal.close()}
    })


    this.listService.modalAfterOrderCreated$.subscribe(d => {
      if(d == true){
        this.orderModal.close()
        this.listService.modalAfterOrderCreated.next(false)
      }
    })
      
    
  }








}
