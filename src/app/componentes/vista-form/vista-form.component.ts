import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vista-form',
  imports: [CommonModule],
  templateUrl: './vista-form.component.html',
  styleUrl: './vista-form.component.css'
})
export class VistaFormComponent {
  @Input() maxWidth: string = "500px";
}
