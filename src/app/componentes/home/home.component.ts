import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from '../../servicios/supabase.service';
import { UsuarioService } from '../../servicios/usuario-service.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  esAdmin = false;

  constructor(private supabaseService: SupabaseService, private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit() {
    const usuario = this.usuarioService.obtenerUsuarioActual();
    this.esAdmin = usuario?.es_admin === true;
  }

  async logout() {
    await this.supabaseService.signOut();
    this.router.navigate(['/login']);
  }
}
