
import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoaderService } from './loader.service';


@Component({
  selector: 'app-loader',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit{
  isLoading:Observable<boolean>

  constructor(private loaderService : LoaderService){}
  ngOnInit(): void {
    this.isLoading = this.loaderService.isLoading$
  }

  

  
}
