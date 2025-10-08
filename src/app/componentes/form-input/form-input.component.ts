import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-input',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-input.component.html',
  styleUrls: [
    './form-input.component.css',
    '../../styles/formulario.css'
  ]
})
export class FormInputComponent {

  @Input() formulario!: FormGroup;
  @Input() controlName: string = "";
  @Input() label: string = "";
  @Input() placeHolder: string = "";
  @Input() type: string = "";
  @Input() errorMessage: string = "";

}
