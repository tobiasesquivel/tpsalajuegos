import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';

interface EstadoWordle {
  intentos: string[][];
  estadoIntentos: string[][];
  intentoActual: number;
  palabraSecreta: string;
  juegoTerminado: boolean;
  victoria: boolean;
  puntaje: number;
}

@Injectable({
  providedIn: 'root'
})
export class WordleService {
  private palabras = [
    'LINUX', 'REDES', 'CLOUD', 'BYTES', 'CHIPS',
    'ROBOT', 'VIRUS', 'DATOS', 'CODES', 'WIFI',
    'EMAIL', 'LOGIN', 'HOSTS', 'ROUTER', 'CACHE',
    'DEBUG', 'FILES', 'PIXEL', 'SCANNER', 'SITES',
    'TOKEN', 'USERS', 'VOICE', 'WIDGET', 'YIELD'
  ];

  private estadoInicial: EstadoWordle = {
    intentos: Array(6).fill(Array(5).fill('')),
    estadoIntentos: Array(6).fill(Array(5).fill('')),
    intentoActual: 0,
    palabraSecreta: '',
    juegoTerminado: false,
    victoria: false,
    puntaje: 0
  };

  private estadoJuego = new BehaviorSubject<EstadoWordle>(this.estadoInicial);
  estadoJuego$ = this.estadoJuego.asObservable();

  constructor(private supabaseService: SupabaseService) {}

  iniciarJuego() {
    const palabraAleatoria = this.palabras[Math.floor(Math.random() * this.palabras.length)];
    this.estadoJuego.next({
      ...this.estadoInicial,
      palabraSecreta: palabraAleatoria
    });
  }

  agregarLetra(letra: string) {
    const estadoActual = this.estadoJuego.value;
    if (estadoActual.juegoTerminado || estadoActual.intentoActual >= 6) return;

    const intentosActualizados = [...estadoActual.intentos];
    const intentoActual = [...intentosActualizados[estadoActual.intentoActual]];
    
    const posicionVacia = intentoActual.findIndex(l => l === '');
    if (posicionVacia !== -1) {
      intentoActual[posicionVacia] = letra;
      intentosActualizados[estadoActual.intentoActual] = intentoActual;
      
      this.estadoJuego.next({
        ...estadoActual,
        intentos: intentosActualizados
      });
    }
  }

  eliminarLetra() {
    const estadoActual = this.estadoJuego.value;
    if (estadoActual.juegoTerminado || estadoActual.intentoActual >= 6) return;

    const intentosActualizados = [...estadoActual.intentos];
    const intentoActual = [...intentosActualizados[estadoActual.intentoActual]];
    
    const ultimaLetra = intentoActual.findIndex(l => l === '');
    if (ultimaLetra === -1) {
      intentoActual[4] = '';
    } else if (ultimaLetra > 0) {
      intentoActual[ultimaLetra - 1] = '';
    }
    
    intentosActualizados[estadoActual.intentoActual] = intentoActual;
    
    this.estadoJuego.next({
      ...estadoActual,
      intentos: intentosActualizados
    });
  }

  verificarIntento() {
    const estadoActual = this.estadoJuego.value;
    if (estadoActual.juegoTerminado || estadoActual.intentoActual >= 6) return;

    const intentoActual = estadoActual.intentos[estadoActual.intentoActual];
    if (intentoActual.some(l => l === '')) return;

    const palabra = intentoActual.join('');
    const estadoIntentos = [...estadoActual.estadoIntentos];
    const nuevoEstado = new Array(5).fill('');

    // Verificar letras correctas
    for (let i = 0; i < 5; i++) {
      if (palabra[i] === estadoActual.palabraSecreta[i]) {
        nuevoEstado[i] = 'correcto';
      } else if (estadoActual.palabraSecreta.includes(palabra[i])) {
        nuevoEstado[i] = 'presente';
      } else {
        nuevoEstado[i] = 'ausente';
      }
    }

    estadoIntentos[estadoActual.intentoActual] = nuevoEstado;

    const victoria = palabra === estadoActual.palabraSecreta;
    const juegoTerminado = victoria || estadoActual.intentoActual === 5;
    const puntaje = victoria ? (6 - estadoActual.intentoActual) * 100 : 0;

    if (juegoTerminado) {
      this.guardarResultado(puntaje);
    }

    this.estadoJuego.next({
      ...estadoActual,
      estadoIntentos,
      intentoActual: estadoActual.intentoActual + 1,
      juegoTerminado,
      victoria,
      puntaje
    });
  }

  private async guardarResultado(puntaje: number) {
    try {
      const session = await this.supabaseService.getSession();
      if (!session?.user) return;

      const { error } = await this.supabaseService.getCliente()
        .from('resultados_juegos')
        .insert([{
          usuario_id: session.user.id,
          juego: 'Wordle',
          puntaje: puntaje,
          fecha: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error al guardar resultado:', error);
    }
  }
}