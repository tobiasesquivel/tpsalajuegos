import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../servicios/supabase.service';

@Component({
  selector: 'app-respuestas-encuesta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './respuestas-encuesta.component.html',
  styleUrls: ['./respuestas-encuesta.component.css']
})
export class RespuestasEncuestaComponent implements OnInit {
  respuestas: any[] = [];
  cargando = true;
  mensaje = '';

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    try {
      const { data, error } = await this.supabaseService.getCliente()
        .from('encuestas')
        .select('*');
      if (error) {
        this.mensaje = 'Error al obtener las respuestas.';
      } else {
        this.respuestas = data || [];
      }
    } catch (e) {
      this.mensaje = 'Error inesperado.';
    }
    this.cargando = false;
  }
} 