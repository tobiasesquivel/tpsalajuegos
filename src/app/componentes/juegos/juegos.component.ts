import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JuegoMiniaturaComponent } from '../juego-miniatura/juego-miniatura.component';

@Component({
  selector: 'app-juegos',
  standalone: true,
  imports: [RouterModule, CommonModule, JuegoMiniaturaComponent],
  templateUrl: './juegos.component.html',
  styleUrls: ['./juegos.component.css'],
})
export class JuegosComponent {}
