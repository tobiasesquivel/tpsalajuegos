import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JuegosRoutingModule } from './juegos-routing.module';
import { JuegosComponent } from '../componentes/juegos/juegos.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    JuegosRoutingModule,
    JuegosComponent
  ]
})
export class JuegosModule { }
