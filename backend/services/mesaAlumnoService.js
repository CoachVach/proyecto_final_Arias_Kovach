
const MesaAlumno = require('../models/mesa_alumno');


class MesaAlumnoService{

    static async verifyMesaWithoutAlumno(id_mesa, id_estudiante){
        const mesaAlumno = await MesaAlumno.findOne({
            where: { id_mesa, id_estudiante: id_estudiante }, 
        });    
        if (mesaAlumno) {
            throw new AppError('El alumno ya está asignado a esta mesa', 409);
        }
    }
    
    static async updatePresentAlumno(id_estudiante, id_mesa, presente){
        await MesaAlumno.update({ presente }, {
            where: {
                id_estudiante: id_estudiante,
                id_mesa: id_mesa
            }
        });
    }

    static async updateDatosAlumno(id_estudiante, id_mesa, presente, inscripto, carrera, plan, codigo, calidad){
        await MesaAlumno.update({ presente, inscripto, carrera, plan, codigo, calidad }, {
            where: {
                id_estudiante: id_estudiante,
                id_mesa: id_mesa
            }
        });
    }
}

module.exports =  MesaAlumnoService;