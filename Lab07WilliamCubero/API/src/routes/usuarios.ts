import { Router } from "express";
import UsuariosController from "../controller/UsuariosController";
// import { checkjwt } from "../middleware/jwt";
// import { checkRoles } from "../middleware/roles";

const routes = Router();

// Rutas para Usuarios
routes.get("/", UsuariosController.getAll); // obtiene todos los usuarios
routes.get("/:cedula", UsuariosController.getByCedula); // obtiene un usuario específico por cédula
routes.post("/", UsuariosController.add); // agrega un usuario
routes.patch("/", UsuariosController.update); // actualiza un usuario
routes.delete("/:cedula", UsuariosController.delete); // elimina un usuario

export default routes;
