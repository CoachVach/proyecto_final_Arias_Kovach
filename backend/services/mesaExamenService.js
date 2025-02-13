const Alumno = require('../models/alumno');
const MesaAlumno = require('../models/mesa_alumno');
const MesaExamen = require('../models/mesa_examen');
const AppError  = require('../structure/AppError');
const ColaboradorMesa = require('../models/colaborador_mesa');

class MesaExamenService{

    static async createMesaExamen(fecha, materia, id_profesor){
        if (!fecha || !materia) {
            throw new AppError('Fecha y materia son requeridos', 400);
        }
        return await MesaExamen.create({
            fecha,
            materia,
            id_profesor: id_profesor
        });
    }

    static async findAllMesas() {
        return await MesaExamen.findAll({ include: { model: Alumno, through: MesaAlumno } });
    }

    static async assingAlumnoToMesa(alumno, mesa, carrera, calidad, codigo, plan, presente, inscripto, actualizar_socket){
        await mesa.addAlumno(alumno, { through: {carrera, calidad, codigo, plan, presente, inscripto } });
    }

    static async validateProfesorMesa(profesorId, mesaId) {
        let mesa = await MesaExamen.findByPk(mesaId);
        if (mesa.id_profesor !== profesorId) {
            let colaboradorMesa = await ColaboradorMesa.findOne({ where: { id_mesa:mesaId, id_profesor: profesorId } });
            if(!colaboradorMesa) throw new AppError('La mesa no pertenece al profesor y tampoco a un colaborador con esta sesión', 403);
        }
        if (!mesa) {
            throw new AppError('Mesa de examen no encontrada', 404);
        }
        return mesa;
    }

    static async deleteMesa(mesa){
        await mesa.destroy();
    }

    static async findMesasByProfesor(id_profesor){
        let mesas = [];
        mesas = await MesaExamen.findAll({ where: { id_profesor: id_profesor } });
        return mesas;
    }
           
}

module.exports =  MesaExamenService;