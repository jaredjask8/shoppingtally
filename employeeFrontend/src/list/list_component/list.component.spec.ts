import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComponent } from './list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { DatepickerComponent } from 'src/global/bootstrap-components/datepicker/datepicker.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ListRoutingModule } from './list-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ButtonsComponent } from '../../global/components/buttons/buttons.component';
import { ListService } from './list.service';
import { ListItemArrayMockWithItemInCart } from './mocks/ListItemArrayMock';
import { ListItemArrayMockWithoutItemInCart } from './mocks/ListItemArrayWithoutItemInCart';
import { TemplateRef } from '@angular/core';
import { ListItem } from '../models/ListItem';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let service:ListService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListComponent ],
      imports:[
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
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        ButtonsComponent
      ],
      providers:[ListService]
    })
    .compileComponents();
    service = TestBed.inject(ListService)
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('set item name / item already in cart / #currentItem should be empty', () => {
    
    //booleans determine the state of the order
    component.hasCurrentOrder = false;
    component.isActiveOrder = false;

    expect(component.hasCurrentOrder).toBeFalsy()
    expect(component.isActiveOrder).toBeFalsy()

    //set the cart to a mock with the same item in the cart
    component.cart = ListItemArrayMockWithItemInCart
    component.setItemName("test")
    expect(component.currentItem).toBe("")

    //switch to currentOrder
    //booleans determine the state of the order
    component.hasCurrentOrder = true;
    component.isActiveOrder = false;

    expect(component.hasCurrentOrder).toBeTruthy()
    expect(component.isActiveOrder).toBeFalsy()

    //set the cart to a mock with the same item in the cart
    component.currentOrderList = ListItemArrayMockWithItemInCart
    component.setItemName("test")
    expect(component.currentItem).toBe("")

    //switch to activeOrder

    //booleans determine the state of the order
    component.hasCurrentOrder = true;
    component.isActiveOrder = true;

    expect(component.hasCurrentOrder).toBeTruthy()
    expect(component.isActiveOrder).toBeTruthy()

    //set the cart to a mock with the same item in the cart
    component.todo = ListItemArrayMockWithItemInCart
    component.setItemName("test")
    expect(component.currentItem).toBe("")
  });

  it('set item name / item not in cart / #currentItem should be expected', () => {
    let spy = spyOn(component,'getImages')
    //booleans determine the state of the order
    component.hasCurrentOrder = false;
    component.isActiveOrder = false;

    //set the cart to a mock with the different item in the cart
    component.cart = ListItemArrayMockWithoutItemInCart
    component.setItemName("test")
    expect(spy).toHaveBeenCalled()
    expect(component.currentItem).toBe("test")

    //switch to current order
    component.hasCurrentOrder = true;
    component.isActiveOrder = false;
    
    expect(component.hasCurrentOrder).toBeTruthy()
    expect(component.isActiveOrder).toBeFalsy()

    component.currentOrderList = ListItemArrayMockWithoutItemInCart
    component.setItemName("test")
    expect(spy).toHaveBeenCalled()
    expect(component.currentItem).toBe("test")

    //switch to active order
    component.hasCurrentOrder = true;
    component.isActiveOrder = true;
    
    expect(component.hasCurrentOrder).toBeTruthy()
    expect(component.isActiveOrder).toBeTruthy()

    component.todo = ListItemArrayMockWithoutItemInCart
    component.setItemName("test")
    expect(spy).toHaveBeenCalled()
    expect(component.currentItem).toBe("test")
  });

  it('checks if items are found in the list already', () => {
    component.hasCurrentOrder = false;
    component.isActiveOrder = false;

    component.cart = ListItemArrayMockWithItemInCart
    expect(component.checkItemValidity("test")).toBeFalsy()

    component.cart = ListItemArrayMockWithoutItemInCart
    expect(component.checkItemValidity("test")).toBeTruthy()
  });

  it('tests cancelling an order from the user', () => {
    component.cancelOrder()
    expect(component.cancelFromUser).toBeTruthy()
  });

  it('tests cancelling an order from deleting the last item in the current order', () => {
    let listItem = new ListItem("test","1","test")
    component.currentOrderList = [listItem]
    component.deleteCurrentOrderItem(listItem)
    expect(component.cancelFromItem).toBeTruthy()
  });

  it('sets the quantity of the item being added', () => {
    component.setQuantity("1")
    expect(component.currentQuantity).toBe("1")
  })

  it('resets the item for a new one to be chosen', () => {
    component.currentItem = "test"
    component.isItemValid = true
    component.currentImage = "test"
    component.resetItem()
    expect(component.currentItem).toBe("")
    expect(component.isItemValid).toBeFalsy()
    expect(component.currentImage).toBe("")

  })

});
