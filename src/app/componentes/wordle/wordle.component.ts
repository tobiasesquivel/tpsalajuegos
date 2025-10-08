import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordleService } from '../../servicios/wordle.service';

@Component({
  selector: 'app-wordle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wordle.component.html',
  styleUrls: ['./wordle.component.css']
})
export class WordleComponent implements OnInit {
  estadoJuego$;
  teclado = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ];

  constructor(public wordleService: WordleService) {
    this.estadoJuego$ = this.wordleService.estadoJuego$;
  }

  ngOnInit(): void {
    this.wordleService.iniciarJuego();
  }

  @HostListener('window:keydown', ['$event'])
  manejarTeclado(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.wordleService.verificarIntento();
    } else if (event.key === 'Backspace') {
      this.wordleService.eliminarLetra();
    } else if (/^[a-zA-ZñÑ]$/.test(event.key)) {
      this.wordleService.agregarLetra(event.key.toUpperCase());
    }
  }

  presionarTecla(tecla: string) {
    if (tecla === 'ENTER') {
      this.wordleService.verificarIntento();
    } else if (tecla === '⌫') {
      this.wordleService.eliminarLetra();
    } else {
      this.wordleService.agregarLetra(tecla);
    }
  }

  obtenerClaseEstado(estado: string): string {
    switch (estado) {
      case 'correcto':
        return 'correcto';
      case 'presente':
        return 'presente';
      case 'ausente':
        return 'ausente';
      default:
        return '';
    }
  }
}
