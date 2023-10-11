import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.css'],
  standalone:true
})
export class EditListComponent {
  constructor(private modalService: NgbModal){}

  open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' })
  }
}
