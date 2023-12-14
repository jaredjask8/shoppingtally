import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule} from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NavComponent } from 'src/global/nav/nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from 'src/register/register.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule } from '@angular/material/icon';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from 'src/home/home/home.component';
import {MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { EnvironmentService } from 'src/global/utility/environment.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { LoginModalComponent } from 'src/global/bootstrap-components/login-modal/login-modal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RegisterModalComponent } from 'src/global/bootstrap-components/register-modal/register-modal.component';
import { OrderModalComponent } from 'src/global/bootstrap-components/order-modal/order-modal.component';
import { MyInterceptor } from './MyInterceptor';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MdbCollapseModule,
    NgbModule,
    MatTableModule,
    MatInputModule,
    NavComponent,
    MatButtonModule,
    RouterModule,
    LoginModalComponent,
    RegisterModalComponent,
    OrderModalComponent
    
  ],
  providers: [EnvironmentService,{ provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
