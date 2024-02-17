import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

  transform(rawNum:string){
    let areaCode = rawNum.substring(0,3)
    let areaCodeFormatted = "("+areaCode+")-"
    let restOfNumber = rawNum.substring(3)
    let restOfNumberFormatted = restOfNumber.substring(0,3)+"-"+restOfNumber.substring(3)
    return areaCodeFormatted+restOfNumberFormatted
  }

}
