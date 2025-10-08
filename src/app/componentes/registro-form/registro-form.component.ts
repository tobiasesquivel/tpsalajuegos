import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormInputComponent } from '../form-input/form-input.component';
import { UsuarioService } from '../../servicios/usuario-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-form',
  imports: [ReactiveFormsModule, RouterLink, FormInputComponent, CommonModule],
  templateUrl: './registro-form.component.html',
  styleUrls: ['./registro-form.component.css',
    '../../styles/formulario.css'],
})
export class RegistroFormComponent implements OnInit {
  formulario!: FormGroup;
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(private router: Router, public servicioUsuario: UsuarioService) { }

  ngOnInit(): void {
    this.formulario = new FormGroup({
      correoElectronico: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      nombreUsuario: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]),
      clave: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
      ])
    });
  }

  async onSubmit() {
    if (this.formulario.valid) {
      this.cargando = true;
      this.mensajeError = '';

      const { error } = await this.servicioUsuario.registrar(
        this.getCorreoElectronico(),
        this.getNombreUsuario(),
        this.getClave()
      );

      if (error) {
        this.mensajeError = error.message || 'Error al registrar usuario';
        this.cargando = false;
      }
    }
  }

  getError(controlName: string): string {
    const control = this.formulario.get(controlName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) return 'Este campo es requerido';
      if (control.errors['email']) return 'Ingrese un correo electrónico válido';
      if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      if (control.errors['pattern']) {
        if (controlName === 'nombreUsuario') {
          return 'Solo letras, números y guiones bajos permitidos';
        }
        if (controlName === 'clave') {
          return 'Debe contener al menos una mayúscula, una minúscula y un número';
        }
      }
    }
    return '';
  }

  public irAHome() {
    this.router.navigate(['/home']);
  }

  public getCorreoElectronico() {
    return this.formulario.get('correoElectronico')?.value;
  }

  public getNombreUsuario() {
    return this.formulario.get('nombreUsuario')?.value;
  }

  public getClave() {
    return this.formulario.get('clave')?.value;
  }

  public crearAdmin() {
    const respuesta = this.servicioUsuario.registrar("tobias15esquivel@gmail.com", "tobias", "Clave123456");
    console.log(respuesta);
  }
}
