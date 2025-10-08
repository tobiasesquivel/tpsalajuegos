import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private supabase: SupabaseClient;
  private usuarioActual: any = null;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.supabase = supabaseService.getCliente();
    this.inicializarUsuario();
  }

  private async inicializarUsuario() {
    const session = await this.supabaseService.getSession();
    if (session?.user) {
      const { data: userData } = await this.supabase
        .from('usuarios')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (userData) {
        this.usuarioActual = {
          ...userData,
          email: session.user.email
        };
      }
    }
  }

  async registrar(email: string, nombreUsuario: string, clave: string) {
    try {
      // Verificar si el usuario ya existe en la tabla usuarios
      const { data: existingUser, error: checkError } = await this.supabase
        .from('usuarios')
        .select('id')
        .eq('nombreusuario', nombreUsuario)
        .maybeSingle();

      if (checkError) {
        console.error('Error al verificar usuario existente:', checkError);
        return { error: { message: 'Error al verificar usuario existente' } };
      }

      if (existingUser) {
        return { error: { message: 'El nombre de usuario ya está en uso' } };
      }

      // Registrar usuario en auth
      const { data, error: signUpError } = await this.supabase.auth.signUp({
        email,
        password: clave,
        options: {
          data: {
            nombreusuario: nombreUsuario
          }
        }
      });

      if (signUpError) {
        console.error('Error en signUp:', signUpError);
        return { error: signUpError };
      }

      if (!data.user) {
        return { error: { message: 'Error al crear el usuario' } };
      }

      // Intentar insertar en la tabla usuarios
      const { error: insertError } = await this.supabase
        .from('usuarios')
        .insert({
          id: data.user.id,
          nombreusuario: nombreUsuario,
          fecha_registro: new Date().toISOString(),
          es_admin: false
        });

      if (insertError) {
        console.error('Error al insertar usuario:', insertError);
        return { error: { message: 'Error al crear el perfil de usuario' } };
      }

      // Redirigir al login
      this.router.navigate(['/login']);
      return { error: null };
    } catch (error) {
      console.error('Error en el registro:', error);
      return { error: { message: 'Error inesperado durante el registro' } };
    }
  }

  async iniciarSesion(email: string, clave: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password: clave
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          return { 
            error: { 
              message: 'Por favor, confirma tu correo electrónico antes de iniciar sesión.' 
            }
          };
        }
        return { error };
      }

      if (data.user) {
        // Obtener datos del usuario
        const { data: userData } = await this.supabase
          .from('usuarios')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userData) {
          this.usuarioActual = {
            ...userData,
            email: data.user.email
          };
        }

        // Registrar el log de ingreso
        await this.supabase
          .from('logs_ingreso')
          .insert({
            usuario_id: data.user.id,
            fecha_ingreso: new Date().toISOString()
          });

        this.router.navigate(['/home']);
      }

      return { error: null };
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      return { error: { message: 'Error inesperado durante el inicio de sesión' } };
    }
  }

  async reenviarConfirmacion(email: string) {
    try {
      const { error } = await this.supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        return { error };
      }

      return { 
        error: null,
        message: 'Se ha reenviado el correo de confirmación. Por favor, revisa tu bandeja de entrada.'
      };
    } catch (error) {
      console.error('Error al reenviar confirmación:', error);
      return { error: { message: 'Error al reenviar el correo de confirmación' } };
    }
  }

  async cerrarSesion() {
    try {
      const success = await this.supabaseService.signOut();
      if (success) {
        this.usuarioActual = null;
        this.router.navigate(['/login']);
      }
      return { error: null };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { error: { message: 'Error inesperado al cerrar sesión' } };
    }
  }

  obtenerUsuarioActual() {
    return this.usuarioActual;
  }

  estaAutenticado() {
    return this.usuarioActual !== null;
  }
}