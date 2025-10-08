import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () => import('./componentes/login/login.component').then(componente => componente.LoginComponent),
  },
  {
    path: "registro",
    loadComponent: () => import('./componentes/registro/registro.component').then(componente => componente.RegistroComponent),
  },
  {
    path: "home",
    loadComponent: () => import('./componentes/home/home.component').then(componente => componente.HomeComponent),
    children:
    [
      {
        path:"",
        redirectTo: "juegos",
        pathMatch: "full"
      },
      {
        path: "juegos",
        loadChildren: ()=> import('./modulo-juegos/juegos.module').then(componente => componente.JuegosModule)
      },
      {
        path: "puntajes",
        loadComponent: ()=> import('./componentes/puntajes/puntajes.component').then(componente => componente.PuntajesComponent)
      },
      {
        path: "quien-soy",
        loadComponent: () => import('./componentes/quien-soy/quien-soy.component').then(componente => componente.QuienSoyComponent),
      },
      {
        path: "chat",
        loadComponent: () => import('./componentes/chat/chat.component').then(componente => componente.ChatComponent),
        canActivate: [authGuard]
      },
      {
        path: "usuario",
        loadComponent: () => import('./componentes/usuario/usuario.component').then(componente => componente.UsuarioComponent),
      },
      {
        path: "encuesta",
        loadComponent: () => import('./componentes/encuesta/encuesta.component').then(componente => componente.EncuestaComponent),
      },
      {
        path: "respuestas-encuesta",
        loadComponent: () => import('./componentes/encuesta/respuestas-encuesta.component').then(m => m.RespuestasEncuestaComponent),
        canActivate: [adminGuard]
      }
    ],
  },
  {
    path: "**",
    loadComponent: () => import('./componentes/error/error.component').then(componente => componente.ErrorComponent),
  }
];
