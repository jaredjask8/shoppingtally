import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-quantity',
  standalone: true,
  imports: [
    CommonModule,
    MatRippleModule
  ],
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.css']
})
export class QuantityComponent {
  @Output() quantityEvent = new EventEmitter<boolean>();
  @Input() itemQuantity:string 
  rippleColor:string="#f7f603"
  
  updateQuantity(update:boolean){
    this.quantityEvent.emit(update)
  }
}
