import { Component, OnInit } from '@angular/core';
import { PuntajesTablaComponent } from '../puntajes-tabla/puntajes-tabla.component';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../servicios/supabase.service';

@Component({
  selector: 'app-puntajes',
  imports: [PuntajesTablaComponent, CommonModule],
  templateUrl: './puntajes.component.html',
  styleUrl: './puntajes.component.css'
})
export class PuntajesComponent implements OnInit {
  juegos = [
    { value: 'ahorcado', label: 'Ahorcado' },
    { value: 'Mayor o Menor', label: 'Mayor o Menor' },
    { value: 'Preguntados', label: 'Preguntados' },
    { value: 'Wordle', label: 'Wordle' }
  ];
  juegoSeleccionado = this.juegos[0].value;
  puntajes: any[] = [];
  cargando = false;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.cargarPuntajes();
  }

  async cargarPuntajes() {
    this.cargando = true;
    // Traer los puntajes
    const { data: puntajes, error } = await this.supabaseService.getCliente()
      .from('resultados_juegos')
      .select('puntaje, fecha, usuario_id')
      .eq('juego', this.juegoSeleccionado)
      .order('puntaje', { ascending: false })
      .limit(10);

    // Traer todos los usuarios (solo id y nombreusuario)
    const { data: usuarios, error: errorUsuarios } = await this.supabaseService.getCliente()
      .from('usuarios')
      .select('id, nombreusuario');

    // Mapear puntajes con nombre de usuario
    this.puntajes = (puntajes || []).map((p: any) => {
      const usuario = (usuarios || []).find((u: any) => u.id === p.usuario_id);
      return {
        ...p,
        nombreusuario: usuario ? usuario.nombreusuario : p.usuario_id
      };
    });
    this.cargando = false;
  }

  onJuegoChange(event: any) {
    this.juegoSeleccionado = event.target.value;
    this.cargarPuntajes();
  }
}
