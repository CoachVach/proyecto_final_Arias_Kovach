const Alumno = require('../models/alumno');
const MesaAlumno = require('../models/mesa_alumno');
const MesaExamen = require('../models/mesa_examen');
const AppError  = require('../structure/AppError');

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

    static async assingAlumnoToMesa(alumno, mesa, carrera, calidad, codigo, plan, presente, inscripto ){
        await mesa.addAlumno(alumno, { through: {carrera, calidad, codigo, plan, presente, inscripto } });
    }

    static async validateProfesorMesa(profesorId, mesaId) {
        const mesa = await MesaExamen.findByPk(mesaId);
        if (mesa.id_profesor !== profesorId) {
            throw new AppError('La mesa no pertenece al profesor.', 403);
        }
        if (!mesa) {
            throw new AppError('Mesa de examen no encontrada', 404);
        }
        return mesa;
    }

    static async updateMesaExamen(mesa, fecha, materia, id_profesor ){
        mesa.update({ fecha, materia, id_profesor });
    }

    static async deleteMesa(mesa){
        await mesa.destroy();
    }

    static async findMesasByProfesor(id_profesor){
        const mesas = await MesaExamen.findAll({ where: { id_profesor: id_profesor } });
        if (!mesas.length) {
            throw new AppError('No se encontraron mesas de examen para este profesor', 404);
        }
        return mesas;
    }
}

module.exports =  MesaExamenService;