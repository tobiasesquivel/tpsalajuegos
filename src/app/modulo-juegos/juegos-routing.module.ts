import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { JuegosComponent } from '../componentes/juegos/juegos.component';

const routes: Routes = [
  {
    path: '',
    component: JuegosComponent
  },
  {
    path: 'ahorcado',
    loadComponent: () => import('../componentes/ahorcado/ahorcado.component').then(componente => componente.AhorcadoComponent)
  },
  {
    path: 'preguntados',
    loadComponent: () => import('../componentes/preguntados/preguntados.component').then(componente => componente.PreguntadosComponent)
  },
  {
    path: 'mayor-o-menor',
    loadComponent: () => import('../componentes/mayor-o-menor/mayor-o-menor.component').then(componente => componente.MayorOMenorComponent)
  },
  {
    path: 'wordle',
    loadComponent: () => import('../componentes/wordle/wordle.component').then(componente => componente.WordleComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), HttpClientModule],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }
