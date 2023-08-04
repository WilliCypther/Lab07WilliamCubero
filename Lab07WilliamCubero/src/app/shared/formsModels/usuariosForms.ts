import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class UsuariosForm {
  baseForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.baseForm = this.fb.group({
      cedula: ['', [Validators.required]],
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      apellido1: ['', [Validators.required, Validators.minLength(5)]],
      apellido2: ['', [Validators.required, Validators.minLength(5)]],
      fecha_ingreso: [Date.now, [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
      estado: [true],
    });
  }
}
