import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PreguntadosService } from '../../servicios/preguntados.service';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.css']
})
export class PreguntadosComponent implements OnInit {
  estadoJuego$;
  imagenCargada = false;
  
  constructor(public preguntadosService: PreguntadosService) {
    this.estadoJuego$ = this.preguntadosService.estadoJuego$;
  }
  
  ngOnInit(): void {
    this.preguntadosService.iniciarJuego();
  }

  seleccionarRespuesta(respuesta: string) {
    this.preguntadosService.verificarRespuesta(respuesta);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif';
    this.imagenCargada = true;
  }

  onImageLoad() {
    this.imagenCargada = true;
  }
}
