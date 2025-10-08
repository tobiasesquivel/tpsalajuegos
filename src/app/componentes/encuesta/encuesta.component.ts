import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../servicios/usuario-service.service';
import { SupabaseService } from '../../servicios/supabase.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-encuesta',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css']
})
export class EncuestaComponent implements OnInit {
  encuestaForm: FormGroup;
  mensaje: string = '';
  cargando: boolean = false;

  preguntasOpciones = [
    { label: '¿Te gustan los juegos de preguntas?', value: 'preguntas', type: 'radio', opciones: ['Sí', 'No'] },
    { label: '¿Qué plataformas usas para jugar?', value: 'plataformas', type: 'checkbox', opciones: ['PC', 'Consola', 'Móvil'] },
    { label: '¿Cuántas horas juegas por semana?', value: 'horas', type: 'select', opciones: ['<5', '5-10', '10-20', '20+'] }
  ];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.encuestaForm = this.fb.group({
      nombre_apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{1,10}$')]],
      preguntas: this.fb.group({
        preguntas: ['', Validators.required],
        plataformas: this.fb.array([]),
        horas: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {}

  onCheckboxChange(e: any) {
    const plataformas: FormArray = this.encuestaForm.get('preguntas.plataformas') as FormArray;
    if (e.target.checked) {
      plataformas.push(this.fb.control(e.target.value));
    } else {
      const index = plataformas.controls.findIndex(x => x.value === e.target.value);
      if (index !== -1) plataformas.removeAt(index);
    }
  }

  async onSubmit() {
    if (this.encuestaForm.invalid) {
      this.mensaje = 'Por favor, completa todos los campos correctamente.';
      return;
    }
    this.cargando = true;
    this.mensaje = '';
    const usuario = this.usuarioService.obtenerUsuarioActual();
    if (!usuario) {
      this.mensaje = 'Debes estar logueado para enviar la encuesta.';
      this.cargando = false;
      return;
    }
    const formValue = this.encuestaForm.value;
    const respuestas = {
      preguntas: formValue.preguntas.preguntas,
      plataformas: formValue.preguntas.plataformas,
      horas: formValue.preguntas.horas
    };
    const { error } = await this.supabaseService.getCliente()
      .from('encuestas')
      .insert([{
        usuario_id: usuario.id,
        nombre_apellido: formValue.nombre_apellido,
        edad: formValue.edad,
        telefono: formValue.telefono,
        respuestas: respuestas,
        fecha: new Date().toISOString()
      }]);
    this.cargando = false;
    if (error) {
      this.mensaje = 'Error al guardar la encuesta.';
    } else {
      this.mensaje = '¡Encuesta enviada correctamente!';
      this.encuestaForm.reset();
    }
  }
} 