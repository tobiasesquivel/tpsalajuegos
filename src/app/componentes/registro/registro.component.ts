import { Component } from '@angular/core';
import { VistaFormComponent } from '../vista-form/vista-form.component';
import { RegistroFormComponent } from '../registro-form/registro-form.component';

@Component({
  selector: 'app-registro',
  imports: [VistaFormComponent, RegistroFormComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {

}
