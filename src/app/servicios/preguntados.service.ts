import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { HttpClient } from '@angular/common/http';

interface Pregunta {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: string;
  imagen: string;
}

@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {
  private readonly GIPHY_API_KEY = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65';
  private readonly GIPHY_API_URL = 'https://api.giphy.com/v1/gifs/search';

  private preguntasBase = [
    {
      pregunta: "¿Cuál es el nombre completo de Homer Simpson?",
      opciones: ["Homer Jay Simpson", "Homer Abraham Simpson", "Homer John Simpson", "Homer James Simpson"],
      respuestaCorrecta: "Homer Jay Simpson",
      busquedaImagen: "homer simpson"
    },
    {
      pregunta: "¿En qué planta de energía nuclear trabaja Homer?",
      opciones: ["Planta Nuclear de Springfield", "Central Nuclear de Shelbyville", "Planta de Energía de Springfield", "Central Eléctrica de Springfield"],
      respuestaCorrecta: "Planta Nuclear de Springfield",
      busquedaImagen: "springfield nuclear power plant"
    },
    {
      pregunta: "¿Cuál es el nombre de la hermana de Lisa?",
      opciones: ["Maggie", "Patty", "Selma", "Marge"],
      respuestaCorrecta: "Maggie",
      busquedaImagen: "maggie simpson"
    },
    {
      pregunta: "¿Quién es el dueño de la Taberna de Moe?",
      opciones: ["Moe Szyslak", "Barney Gumble", "Lenny Leonard", "Carl Carlson"],
      respuestaCorrecta: "Moe Szyslak",
      busquedaImagen: "moe's tavern"
    },
    {
      pregunta: "¿Cuál es el nombre del perro de la familia Simpson?",
      opciones: ["Ayudante de Santa", "Bola de Nieve", "Laddie", "Santa's Little Helper"],
      respuestaCorrecta: "Ayudante de Santa",
      busquedaImagen: "santas little helper simpsons"
    },
    {
      pregunta: "¿En qué escuela estudian Bart y Lisa?",
      opciones: ["Escuela Primaria de Springfield", "Colegio de Springfield", "Instituto de Springfield", "Academia de Springfield"],
      respuestaCorrecta: "Escuela Primaria de Springfield",
      busquedaImagen: "springfield elementary school"
    },
    {
      pregunta: "¿Cuál es el nombre del director de la Escuela Primaria de Springfield?",
      opciones: ["Seymour Skinner", "Superintendente Chalmers", "Ned Flanders", "Reverendo Lovejoy"],
      respuestaCorrecta: "Seymour Skinner",
      busquedaImagen: "principal skinner simpsons"
    },
    {
      pregunta: "¿Cuál es el nombre del bar de Moe?",
      opciones: ["La Taberna de Moe", "El Bar de Moe", "La Cantina de Moe", "El Pub de Moe"],
      respuestaCorrecta: "La Taberna de Moe",
      busquedaImagen: "moes tavern simpsons"
    },
    {
      pregunta: "¿Cuál es el nombre del vecino de los Simpson?",
      opciones: ["Ned Flanders", "Reverendo Lovejoy", "Dr. Hibbert", "Apu Nahasapeemapetilon"],
      respuestaCorrecta: "Ned Flanders",
      busquedaImagen: "ned flanders simpsons"
    },
    {
      pregunta: "¿Cuál es el nombre del dueño de la tienda de conveniencia Kwik-E-Mart?",
      opciones: ["Apu Nahasapeemapetilon", "Moe Szyslak", "Barney Gumble", "Lenny Leonard"],
      respuestaCorrecta: "Apu Nahasapeemapetilon",
      busquedaImagen: "apu kwik e mart"
    }
  ];

  private preguntas: Pregunta[] = [];
  private preguntaActual: Pregunta | null = null;
  private puntaje = 0;
  private intentosRestantes = 3;
  private juegoTerminado = false;

  private estadoJuego = new BehaviorSubject<{
    preguntaActual: Pregunta | null,
    puntaje: number,
    intentosRestantes: number,
    juegoTerminado: boolean
  }>({
    preguntaActual: null,
    puntaje: 0,
    intentosRestantes: 3,
    juegoTerminado: false
  });

  

  estadoJuego$ = this.estadoJuego.asObservable();

  constructor(
    private supabaseService: SupabaseService,
    private http: HttpClient
  ) {
    this.cargarPreguntas();
  }

  private async cargarPreguntas() {
    try {
      this.preguntas = await Promise.all(
        this.preguntasBase.map(async (pregunta) => {
          const imagen = await this.obtenerImagenGiphy(pregunta.busquedaImagen);
          return {
            pregunta: pregunta.pregunta,
            opciones: pregunta.opciones,
            respuestaCorrecta: pregunta.respuestaCorrecta,
            imagen: imagen
          };
        })
      );
      this.iniciarJuego();
    } catch (error) {
      console.error('Error al cargar preguntas:', error);
    }
  }

  private async obtenerImagenGiphy(busqueda: string): Promise<string> {
    try {
      const response = await this.http.get(`${this.GIPHY_API_URL}?api_key=${this.GIPHY_API_KEY}&q=${busqueda}&limit=1&rating=g`).toPromise();
      const data = response as any;
      if (data.data && data.data.length > 0) {
        return data.data[0].images.original.url;
      }
    } catch (error) {
      console.error('Error al obtener imagen de Giphy:', error);
    }
    return 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif';
  }

  iniciarJuego() {
    this.puntaje = 0;
    this.intentosRestantes = 3;
    this.juegoTerminado = false;
    this.siguientePregunta();
  }

  private siguientePregunta() {
    if (this.preguntas.length > 0) {
      const indice = Math.floor(Math.random() * this.preguntas.length);
      this.preguntaActual = this.preguntas[indice];
      this.preguntas.splice(indice, 1);
    } else {
      this.juegoTerminado = true;
      this.guardarResultado();
    }
    this.actualizarEstado();
  }

  verificarRespuesta(respuesta: string) {
    if (!this.preguntaActual || this.juegoTerminado) return;

    if (respuesta === this.preguntaActual.respuestaCorrecta) {
      this.puntaje += 10;
    } else {
      this.intentosRestantes--;
      if (this.intentosRestantes <= 0) {
        this.juegoTerminado = true;
        this.guardarResultado();
      }
    }

    this.siguientePregunta();
  }

  private async guardarResultado() {
    try {
      const session = await this.supabaseService.getSession();
      if (!session?.user) return;

      await this.supabaseService.getCliente()
        .from('resultados_juegos')
        .insert([{
          usuario_id: session.user.id,
          juego: 'Preguntados',
          puntaje: this.puntaje
        }]);
    } catch (error) {
      console.error('Error al guardar resultado:', error);
    }
  }

  private actualizarEstado() {
    this.estadoJuego.next({
      preguntaActual: this.preguntaActual,
      puntaje: this.puntaje,
      intentosRestantes: this.intentosRestantes,
      juegoTerminado: this.juegoTerminado
    });
  }
} 