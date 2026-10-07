import { Component } from '@angular/core';

@Component({
  selector: 'app-contacto',
  standalone: false,
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {
  nombre = '';
  correo = '';
  motivo = '';
  mensaje = '';

  formularioEnviado = false;
  errorFormulario = false;

  enviarFormulario(): void {
    if (!this.nombre.trim() || !this.correo.trim() || !this.motivo || !this.mensaje.trim()) {
      this.errorFormulario = true;
      this.formularioEnviado = false;
      return;
    }

    this.errorFormulario = false;
    this.formularioEnviado = true;

    this.nombre = '';
    this.correo = '';
    this.motivo = '';
    this.mensaje = '';
  }
}
