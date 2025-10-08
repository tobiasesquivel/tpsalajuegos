import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../servicios/chat.service';
import { SupabaseService } from '../../servicios/supabase.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  nuevoMensaje = '';
  usuarioId: string | null = null;

  constructor(
    public chatService: ChatService,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    const session = await this.supabaseService.getSession();
    this.usuarioId = session?.user?.id || null;
  }

  async enviarMensaje() {
    if (this.nuevoMensaje.trim()) {
      await this.chatService.enviarMensaje(this.nuevoMensaje);
      this.nuevoMensaje = '';
      this.recargarMensajes();
    }
  }

  recargarMensajes() {
    this.chatService["cargarMensajes"]();
  }
} 