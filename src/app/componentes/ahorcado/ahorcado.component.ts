import { Component, OnInit } from '@angular/core';
import { AhorcadoService } from '../../servicios/ahorcado.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent implements OnInit {
  letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  estadoJuego$;
  puntajeTotal = 0;
  puntajePartida = 0;
  palabraActual = '';
  
  constructor(public ahorcadoService: AhorcadoService) {
    this.estadoJuego$ = this.ahorcadoService.estadoJuego$;
    this.estadoJuego$.subscribe(estado => {
      if (estado) {
        this.puntajeTotal = estado.puntajeTotal;
        this.puntajePartida = estado.puntajePartida;
        this.palabraActual = estado.palabraActual;
      }
    });
  }
  
  ngOnInit(): void {
    this.ahorcadoService.iniciarJuego();
  }
}
