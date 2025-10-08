import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.apiUrl,
      environment.publicAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );
  }
  
  getCliente(): SupabaseClient {
    return this.supabase;
  }

  async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (error) {
      console.error('Error al obtener la sesión:', error);
      return null;
    }
    return session;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
      return false;
    }
    return true;
  }
}
