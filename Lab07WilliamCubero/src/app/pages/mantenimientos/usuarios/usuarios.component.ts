import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Usuarios } from 'src/app/shared/models/usuarios.model'; // ajusta la ruta según sea necesario
import { UsuariosService } from 'src/app/shared/services/usuarios.service'; // reemplaza con tu servicio
import { AdminUsuariosComponent } from './admin-usuarios/admin-usuarios.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent {
  displayedColumns: string[] = ['cedula', 'nombre', 'apellido1', 'apellido2', 'fecha_ingreso', 'correo', 'rol', 'estado', 'acciones'];

  dataSource = new MatTableDataSource();

  constructor(
    private srvUsuarios: UsuariosService, // reemplaza con tu servicio
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.srvUsuarios.getAll().subscribe((usuarios) => {
      console.log(usuarios);
      this.dataSource.data = usuarios;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  update(): void {
    alert('modificar');
  }

  eliminar(cedula: number): void {
    this.srvUsuarios.eliminar(cedula.toString()).subscribe(
      (dato) => {
        alert('Se eliminó el usuario');
      },
      (err) => {
        alert('Error al eliminar');
      }
    );
}


  detalle(dato: Usuarios): void {
    alert(dato.nombre);
  }

  abrirDialog(usuario?: Usuarios): void {
    if (usuario) {
      this.dialog.open(AdminUsuariosComponent, {
        width: '700px',
        height: '700px',
        data: { usuario },
      });
    } else {
      this.dialog.open(AdminUsuariosComponent, {
        width: '700px',
        height: '700px',
      });
    }
  }
}
