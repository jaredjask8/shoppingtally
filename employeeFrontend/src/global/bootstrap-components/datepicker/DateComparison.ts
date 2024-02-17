import { NgbDate, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export class DateComparison{
    selectedDate:NgbDate;
    currentDate:NgbDate;

    constructor(selectedDate:NgbDate,currentDate:NgbDate){
        this.selectedDate = selectedDate
        this.currentDate = currentDate
    }
}