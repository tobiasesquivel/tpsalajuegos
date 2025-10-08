import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrls: [
    './login-form.component.css',
    '../../styles/formulario.css'
  ]
})
export class LoginFormComponent implements OnInit {
  formulario!: FormGroup;
  mensajeError: string = '';
  mensajeExito: string = '';
  cargando: boolean = false;
  necesitaConfirmacion: boolean = false;
  emailPendiente: string = '';

  // Usuarios de acceso rápido
  accesosRapidos = [
    { email: 'tobias15esquivel@gmail.com', clave: 'Clave123456' }
  ];

  constructor(private servicioUsuario: UsuarioService) { }

  ngOnInit(): void {
    this.formulario = new FormGroup({
      correoElectronico: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      clave: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  async onSubmit() {
    if (this.formulario.valid) {
      this.cargando = true;
      this.mensajeError = '';
      this.mensajeExito = '';
      this.necesitaConfirmacion = false;

      const { error } = await this.servicioUsuario.iniciarSesion(
        this.getCorreoElectronico(),
        this.getClave()
      );

      if (error) {
        this.mensajeError = error.message;
        this.cargando = false;
      }
    }
  }

  async reenviarConfirmacion() {
    if (this.emailPendiente) {
      this.cargando = true;
      this.mensajeError = '';
      this.mensajeExito = '';

      const { error, message } = await this.servicioUsuario.reenviarConfirmacion(this.emailPendiente);

      if (error) {
        this.mensajeError = error.message;
      } else {
        this.mensajeExito = message;
        this.necesitaConfirmacion = false;
      }
      this.cargando = false;
    }
  }

  accesoRapido(usuario: { email: string, clave: string }) {
    this.formulario.patchValue({
      correoElectronico: usuario.email,
      clave: usuario.clave
    });
    this.onSubmit();
  }

  getError(controlName: string): string {
    const control = this.formulario.get(controlName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es requerido';
      if (control.errors['email']) return 'Ingrese un correo electrónico válido';
      if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }

  public getCorreoElectronico() {
    return this.formulario.get('correoElectronico')?.value;
  }

  public getClave() {
    return this.formulario.get('clave')?.value;
  }

}
