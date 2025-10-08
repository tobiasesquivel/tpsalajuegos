import { Component } from '@angular/core';
import { VistaFormComponent } from '../vista-form/vista-form.component';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  selector: 'app-login',
  imports: [VistaFormComponent, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
