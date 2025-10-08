import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vista-practica',
  imports: [CommonModule, FormsModule],
  templateUrl: './vista-practica.component.html',
  styleUrl: './vista-practica.component.css'
})
export class VistaPracticaComponent {
  altura: string = "100vh";
  valorInputAltura: string = "";

  public cambiarAltura(){
    this.altura = this.valorInputAltura;
  }


}
