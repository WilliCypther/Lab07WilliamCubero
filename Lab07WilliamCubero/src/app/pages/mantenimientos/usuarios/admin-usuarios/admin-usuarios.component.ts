import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuarios } from 'src/app/shared/models/usuarios.model';
import { UsuariosService } from 'src/app/shared/services/usuarios.service';
import { UsuariosForm } from 'src/app/shared/formsModels/usuariosForms'; 
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.scss']
})
export class AdminUsuariosComponent implements OnInit {
  usuarioForm: UsuariosForm;
  titulo = '';
  isCreate = true;

  constructor(
    public dialogRef: MatDialogRef<AdminUsuariosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: Usuarios },
    private srvUsuarios: UsuariosService,
    private fb: FormBuilder  
  ) {
    this.usuarioForm = new UsuariosForm(fb);  
  }

  ngOnInit(): void {
    if (this.data && this.data.usuario) {
      this.titulo = 'Modificacion del Usuario';
      this.isCreate = false;
      this.usuarioForm.baseForm.patchValue(this.data.usuario);
    } else {
      this.titulo = 'Crear el usuario:';
      this.isCreate = true;
    }
  }

  guardar(): void {
    console.log(' Atencion el formulario es valido comple los requisitos:', this.usuarioForm.baseForm.valid);
    if (this.usuarioForm.baseForm.valid) {
      if (this.isCreate) {
        this.srvUsuarios.save(this.usuarioForm.baseForm.value).subscribe(
          res => {
            alert('Atencion el usuario fue creado exitosamente');
            this.dialogRef.close(res);
          },
          err => {
            console.log('Atencion este este ID ya esta creado en la base de datos', err);
            if (err.error && err.error.mensaje === 'Existente en la base de datos') {
              alert('Atencion este este ID ya esta creado en la base de datos');
            } else { 
              alert(' Atencion este este ID ya esta creado en la base de datos ');
            }
          } 
        );
      } else {
        console.log('Atencion se modifico correctamente este usuario...');
        if (this.usuarioForm.baseForm.controls) {
          const updatedFields: { [key: string]: any } = Object.keys(this.usuarioForm.baseForm.controls)
            .filter(key => this.usuarioForm.baseForm.get(key)?.dirty)
            .reduce((obj: { [key: string]: any }, key) => {
              const value = this.usuarioForm.baseForm.get(key)?.value;
              if (value) obj[key] = value;
              return obj;
            }, {});
          
          const cedula = this.usuarioForm.baseForm.get('cedula')?.value;
  
          const usuarioModificado = { ...this.data.usuario, ...updatedFields, cedula };
  
          this.srvUsuarios.update(usuarioModificado as Usuarios).subscribe(
            res => {
              alert('Atencion el Usuario fue modificado correctamente');
              this.dialogRef.close(res);
            },
            err => {
              console.log('Atencion USUARIO hubo un error al modificar el usuario:', err);
            }
          );
        }
      }
    } else {
      alert('Atencion USUARIO hubo un error en el formulario revise los campos que se encuentran en rojo ');
    }
  }
  
}
