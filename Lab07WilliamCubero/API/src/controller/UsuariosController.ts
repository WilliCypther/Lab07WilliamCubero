import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usuarios } from "../entity/Usuario";
import { validate } from "class-validator";
import { errorMonitor } from "events";

class UsuariosController {
  static getAll = async (req: Request, resp: Response) => {
    try {
      const repoUsuario = AppDataSource.getRepository(Usuarios);
      const listaUsuario = await repoUsuario.find({ where: { estado: true } });

      if (listaUsuario.length == 0) {
        return resp
          .status(404)
          .json({ mensaje: "No hay registros de usuarios" });
      }

      return resp.status(200).json(listaUsuario);
    } catch (error) {
      return resp
        .status(400)
        .json({ mensaje: "Error desconocido. PAGUE 50MIL DOLARES" });
    }
  };

  static add = async (req: Request, resp: Response) => {
    try {
      const { cedula, nombre, apellido1, apellido2, correo, rol, contrasena } = req.body;
  
      // typescript
      const fecha = new Date();
  
      let usuario = new Usuarios();
      usuario.cedula = cedula;
      usuario.nombre = nombre;
      usuario.apellido1 = apellido1;
      usuario.apellido2 = apellido2;
      usuario.fecha_ingreso = fecha;
      usuario.correo = correo;
      usuario.contrasena = contrasena;
      usuario.rol = rol;
      usuario.estado = true;
  
      //validacion de datos de entrada
      const validateOpt = { validationError: { target: false, value: false } };
      const errores = await validate(usuario, validateOpt);
  
      if (errores.length != 0) {
        return resp.status(400).json(errores);
      }
      // reglas de negocio
      // valiando que el usuario o haya sido creado anteriormente
      const repoUsuario = AppDataSource.getRepository(Usuarios);
      let usuarioExist = await repoUsuario.findOne({
        where: { cedula: cedula },
      });
      if (usuarioExist) {
        return resp.status(400).json({ mensaje: "El usuario ya existe" });
      }
  
      // validando que el correo no este registrado a algun usuario ya creado
      usuarioExist = await repoUsuario.findOne({ where: { correo: correo } });
      if (usuarioExist) {
        return resp.status(400).json({ mensaje: "Ya existe un usuario registrado con el correo" });
      }
  
      usuario.hashPassword();
  
      try {
        await repoUsuario.save(usuario);
        return resp.status(201).json({ mensaje: "Se ha creado el usuario" });
      } catch (error) {
        // manejo de error para violación de unicidad
        if (error.code === '23505') {
          return resp.status(400).json({ mensaje: "La cédula del usuario ya existe" });
        } else {
          return resp.status(400).json({ mensaje: "Error al crear el usuario", error: error });
        }
      }
    } catch (error) {
      return resp.status(400).json({ mensaje: "Error desconocido.", error: error });
    }
  };
  
  static getByCedula = async (req: Request, resp: Response) => {
    try {
      const cedula = req.params.cedula;
      const repoUsuario = AppDataSource.getRepository(Usuarios);
      const usuario = await repoUsuario.findOne({ where: { cedula: cedula } });

      if (!usuario) {
        return resp.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      return resp.status(200).json(usuario);
    } catch (error) {
      return resp.status(400).json({ mensaje: "Error desconocido." });
    }
  };

  static update = async (req: Request, resp: Response) => {
    try {
      const { cedula, nombre, apellido1, apellido2, correo, rol, contrasena } = req.body;
      const repoUsuario = AppDataSource.getRepository(Usuarios);
      let usuario = await repoUsuario.findOne({ where: { cedula: cedula } });

      if (!usuario) {
        return resp.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      // Actualizar los campos necesarios
      usuario.nombre = nombre;
      usuario.apellido1 = apellido1;
      usuario.apellido2 = apellido2;
      usuario.correo = correo;
      usuario.contrasena = contrasena;
      usuario.rol = rol;

      await repoUsuario.save(usuario);
      
      return resp.status(200).json({ mensaje: "Usuario actualizado" });
    } catch (error) {
      return resp.status(400).json({ mensaje: "Error desconocido." });
    }
  };

  static delete = async (req: Request, resp: Response) => {
    try {
      const cedula = req.params.cedula;
      const repoUsuario = AppDataSource.getRepository(Usuarios);
      const usuario = await repoUsuario.findOne({ where: { cedula: cedula } });

      if (!usuario) {
        return resp.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      await repoUsuario.remove(usuario);
      
      return resp.status(200).json({ mensaje: "Usuario eliminado" });
    } catch (error) {
      return resp.status(400).json({ mensaje: "Error desconocido." });
    }
  };

}

export default UsuariosController;
