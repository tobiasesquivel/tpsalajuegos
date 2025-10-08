import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../servicios/usuario-service.service';

export const authGuard: CanActivateFn = () => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);
  if (usuarioService.estaAutenticado()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const adminGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService);
  const usuario = usuarioService.obtenerUsuarioActual();
  if (usuario && usuario.es_admin === true) {
    return true;
  } else {
    // Opcional: redirigir a home o mostrar error
    return false;
  }
}; 