import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';

interface Carta {
  valor: number;
  palo: string;
  texto: string;
}

interface EstadoJuego {
  mazo: Carta[];
  cartaActual: Carta | null;
  cartaAnterior: Carta | null;
  puntaje: number;
  intentosRestantes: number;
  juegoTerminado: boolean;
  mensaje: string;
  historial: {
    carta: string;
    adivinado: boolean;
    puntaje: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class MayorMenorService {
  private readonly MAX_INTENTOS = 10;

  private estadoInicial: EstadoJuego = {
    mazo: [],
    cartaActual: null,
    cartaAnterior: null,
    puntaje: 0,
    intentosRestantes: this.MAX_INTENTOS,
    juegoTerminado: false,
    mensaje: '',
    historial: []
  };

  private estadoJuego = new BehaviorSubject<EstadoJuego>(this.estadoInicial);
  estadoJuego$ = this.estadoJuego.asObservable();

  constructor(private supabaseService: SupabaseService) {}

  iniciarJuego() {
    const mazo = this.crearMazo();
    this.mezclarMazo(mazo);
    const cartaActual = mazo.pop()!;
    
    this.estadoJuego.next({
      ...this.estadoInicial,
      mazo,
      cartaActual,
      mensaje: `¿La siguiente carta será mayor o menor? (Intentos restantes: ${this.MAX_INTENTOS})`
    });
  }

  private crearMazo(): Carta[] {
    const palos = ['♠', '♥', '♦', '♣'];
    const mazo: Carta[] = [];

    for (let valor = 1; valor <= 13; valor++) {
      for (const palo of palos) {
        mazo.push({
          valor,
          palo,
          texto: this.obtenerTextoCarta(valor, palo)
        });
      }
    }

    return mazo;
  }

  private mezclarMazo(mazo: Carta[]) {
    for (let i = mazo.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mazo[i], mazo[j]] = [mazo[j], mazo[i]];
    }
  }

  private obtenerTextoCarta(valor: number, palo: string): string {
    const valorCarta = valor === 1 ? 'A' : 
                      valor === 11 ? 'J' : 
                      valor === 12 ? 'Q' : 
                      valor === 13 ? 'K' : 
                      valor.toString();
    return `${valorCarta}${palo}`;
  }

  adivinar(esMayor: boolean) {
    const estadoActual = this.estadoJuego.value;
    if (estadoActual.juegoTerminado || estadoActual.intentosRestantes <= 0) return;

    const cartaAnterior = estadoActual.cartaActual;
    const cartaActual = estadoActual.mazo.pop()!;
    const acierto = esMayor ? 
      cartaActual.valor > cartaAnterior!.valor : 
      cartaActual.valor < cartaAnterior!.valor;

    const nuevoPuntaje = acierto ? estadoActual.puntaje + 1 : estadoActual.puntaje;
    const intentosRestantes = estadoActual.intentosRestantes - 1;
    const juegoTerminado = intentosRestantes <= 0;

    const historial = [...estadoActual.historial, {
      carta: cartaActual.texto,
      adivinado: acierto,
      puntaje: nuevoPuntaje
    }];

    let mensaje = acierto ? 
      '¡Correcto! ¿Y la siguiente?' : 
      '¡Incorrecto! ¿Y la siguiente?';
    
    if (juegoTerminado) {
      mensaje = `¡Juego terminado! Puntaje final: ${nuevoPuntaje}`;
      this.guardarResultado(nuevoPuntaje);
    } else {
      mensaje += ` (Intentos restantes: ${intentosRestantes})`;
    }

    this.estadoJuego.next({
      ...estadoActual,
      cartaActual,
      cartaAnterior,
      puntaje: nuevoPuntaje,
      intentosRestantes,
      juegoTerminado,
      mensaje,
      historial
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
          juego: 'Mayor o Menor',
          puntaje: puntaje,
          fecha: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error al guardar resultado:', error);
    }
  }
}