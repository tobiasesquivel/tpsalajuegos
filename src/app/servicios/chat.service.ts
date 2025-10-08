import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';

interface Mensaje {
  usuario: string;
  usuario_id: string;
  texto: string;
  fecha: Date;
}

interface MensajeDB {
  texto: string;
  fecha: string;
  usuarios: {
    nombreUsuario: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private mensajes = new BehaviorSubject<Mensaje[]>([]);
  mensajes$ = this.mensajes.asObservable();
  private subscription: any;

  constructor(private supabaseService: SupabaseService) {
    this.cargarMensajes();
    this.suscribirseTiempoReal();
  }

  private async cargarMensajes() {
    try {
      const { data: mensajes, error } = await this.supabaseService.getCliente()
        .from('mensajes_chat')
        .select(`
          texto,
          fecha,
          usuario_id,
          usuarios:usuario_id (
            nombreusuario
          )
        `)
        .order('fecha', { ascending: true });

      if (error) throw error;

      const mensajesFormateados = mensajes.map((m: any) => ({
        usuario: m.usuarios?.nombreusuario,
        usuario_id: m.usuario_id,
        texto: m.texto,
        fecha: new Date(m.fecha)
      }));

      this.mensajes.next(mensajesFormateados);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
    }
  }

  private async suscribirseTiempoReal() {
    const supabase = this.supabaseService.getCliente();
    this.subscription = supabase
      .channel('mensajes_chat_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mensajes_chat' }, () => {
        this.cargarMensajes();
      })
      .subscribe();
  }

  async enviarMensaje(texto: string) {
    try {
      const session = await this.supabaseService.getSession();
      if (!session?.user) return;

      const { error } = await this.supabaseService.getCliente()
        .from('mensajes_chat')
        .insert([{
          usuario_id: session.user.id,
          texto: texto
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  }
} 