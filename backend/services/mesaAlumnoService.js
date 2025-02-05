
const MesaAlumno = require('../models/mesa_alumno');
const AppError = require('../structure/AppError');


class MesaAlumnoService{

    static async verifyAlumnoIsInMesa(id_mesa, id_estudiante){
        const mesaAlumno = await MesaAlumno.findOne({
            where: { id_mesa:id_mesa, id_estudiante: id_estudiante }, 
        });    
        return mesaAlumno !== null;
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


    static async updateNotasAlumnos(id_mesa, notasById){
        for (const nota of notasById) {
            if (!nota.id_estudiante || nota.nota == null) {
                throw new AppError('Cada nota debe tener un id_estudiante y un valor de nota', 400);
            }

            let flag = await this.verifyAlumnoIsInMesa(id_mesa, nota.id_estudiante);
            if(flag){
                try {
                    await MesaAlumno.update({nota: String (nota.nota)},{
                        where: {
                            id_estudiante: nota.id_estudiante,
                            id_mesa: id_mesa
                        } 
                    });
                } catch (error) {
                    throw new AppError('Error al actualizar la nota del alumno', 500);
                }
            }
        }
    }
}

module.exports =  MesaAlumnoService;