import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuario: any = null;
  mostrarClave: boolean = false;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.usuario = this.usuarioService.obtenerUsuarioActual();
  }

  toggleMostrarClave() {
    this.mostrarClave = !this.mostrarClave;
  }
} 