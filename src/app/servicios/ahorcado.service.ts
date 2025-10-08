import { Injectable, OnInit } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AhorcadoService implements OnInit {
  private supabase: SupabaseClient;
  private palabras = [
    'ANGULAR', 'TYPESCRIPT', 'JAVASCRIPT', 'HTML', 'CSS',
    'PROGRAMACION', 'COMPUTADORA', 'INTERNET', 'DESARROLLO',
    'APLICACION', 'INTERFAZ', 'USUARIO', 'BASE', 'DATOS'
  ];
  
  private palabraActual = '';
  private letrasUsadas: string[] = [];
  private intentosRestantes = 6;
  private juegoGanado = false;
  private juegoPerdido = false;
  private puntajeTotal = 0;
  private puntajePartida = 0;

  private estadoJuego = new BehaviorSubject<{
    palabraOculta: string,
    letrasUsadas: string[],
    intentosRestantes: number,
    juegoGanado: boolean,
    juegoPerdido: boolean,
    puntajeTotal: number,
    puntajePartida: number,
    palabraActual: string
  }>({
    palabraOculta: '',
    letrasUsadas: [],
    intentosRestantes: 6,
    juegoGanado: false,
    juegoPerdido: false,
    puntajeTotal: 0,
    puntajePartida: 0,
    palabraActual: ''
  });

  estadoJuego$ = this.estadoJuego.asObservable();

  constructor(private supabaseService: SupabaseService){
    this.supabase = supabaseService.getCliente();
  }

  ngOnInit(): void {
    this.cargarPuntajeTotal();
    this.iniciarJuego();
  }

  private async cargarPuntajeTotal() {
    try {
      const session = await this.supabaseService.getSession();
      if (!session?.user) return;

      const { data, error } = await this.supabase
        .from('resultados_juegos')
        .select('puntaje')
        .eq('usuario_id', session.user.id)
        .eq('juego', 'ahorcado');

      if (error) throw error;

      this.puntajeTotal = data.reduce((sum, result) => sum + result.puntaje, 0);
      this.actualizarEstado();
    } catch (error) {
      console.error('Error al cargar puntaje:', error);
    }
  }

  iniciarJuego() {
    this.palabraActual = this.obtenerPalabraAleatoria();
    this.letrasUsadas = [];
    this.intentosRestantes = 6;
    this.juegoGanado = false;
    this.juegoPerdido = false;
    this.puntajePartida = 0;
    this.actualizarEstado();
  }

  private obtenerPalabraAleatoria(): string {
    const indice = Math.floor(Math.random() * this.palabras.length);
    return this.palabras[indice];
  }

  private actualizarEstado() {
    const palabraOculta = this.palabraActual
      .split('')
      .map(letra => this.letrasUsadas.includes(letra) ? letra : '_')
      .join(' ');

    this.estadoJuego.next({
      palabraOculta,
      letrasUsadas: [...this.letrasUsadas],
      intentosRestantes: this.intentosRestantes,
      juegoGanado: this.juegoGanado,
      juegoPerdido: this.juegoPerdido,
      puntajeTotal: this.puntajeTotal,
      puntajePartida: this.puntajePartida,
      palabraActual: this.palabraActual
    });
  }

  intentarLetra(letra: string) {
    if (this.juegoGanado || this.juegoPerdido || this.letrasUsadas.includes(letra)) {
      return;
    }

    this.letrasUsadas.push(letra);

    if (!this.palabraActual.includes(letra)) {
      this.intentosRestantes--;
    } else {
      // Sumar puntos por letra correcta
      this.puntajePartida += 10;
    }

    // Verificar si ganó
    this.juegoGanado = this.palabraActual
      .split('')
      .every(letra => this.letrasUsadas.includes(letra));

    // Verificar si perdió
    this.juegoPerdido = this.intentosRestantes === 0;

    this.actualizarEstado();

    // Si el juego terminó, guardar resultado
    if (this.juegoGanado || this.juegoPerdido) {
      this.guardarResultado();
    }
  }

  private async guardarResultado() {
    try {
      const session = await this.supabaseService.getSession();
      if (!session?.user) return;

      const puntaje = this.juegoGanado ? this.puntajePartida : 0;
      this.puntajeTotal += puntaje;

      await this.supabase
        .from('resultados_juegos')
        .insert([{
          usuario_id: session.user.id,
          juego: 'ahorcado',
          puntaje: puntaje,
          fecha: new Date().toISOString()
        }]);

      this.actualizarEstado();
    } catch (error) {
      console.error('Error al guardar resultado:', error);
    }
  }

} 