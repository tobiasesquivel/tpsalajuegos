import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-puntajes-tabla',
  imports: [CommonModule],
  templateUrl: './puntajes-tabla.component.html',
  styleUrl: './puntajes-tabla.component.css'
})
export class PuntajesTablaComponent {
  @Input() puntajes: any[] = [];
  @Input() cargando: boolean = false;
}
