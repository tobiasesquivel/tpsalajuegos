import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-juego-miniatura',
  imports: [],
  templateUrl: './juego-miniatura.component.html',
  styleUrl: './juego-miniatura.component.css',
})
export class JuegoMiniaturaComponent {
  public constructor(private router: Router) {}

  @Input() foto: string = '';
  @Input() tamanioFoto: {
    alto: string;
    ancho: string;
  } = { alto: '200', ancho: '200' };

  @Input() nombreJuego: string = '';
  @Input() pathJuego: string = '';

  public s() {
    console.log(this.tamanioFoto.alto);
  }

  public redireccionarJuego() {
    this.router.navigate([`${this.router.url}/${this.pathJuego}`]);
  }
}
