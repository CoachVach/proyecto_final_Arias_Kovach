const Alumno = require('../models/alumno');
const MesaAlumno = require('../models/mesa_alumno');
const MesaExamen = require('../models/mesa_examen');
const AppError  = require('../structure/AppError');
const MesaExamenService = require('../services/mesaExamenService');


class AlumnoService{

    static async createAlumno(doc, nro_identidad, lu, nombre_completo){
        return await Alumno.create({ doc, nro_identidad, lu, nombre_completo });
    }

    static async updateAlumno(alumno, doc, nro_identidad, lu, nombre_completo){
        alumno.update({ doc, nro_identidad, lu, nombre_completo});
    }

    static async deleteAlumno(alumno){
        alumno.delete;
    }

    static async findAllAlumnos() {
        return await (Alumno.findAll({ 
            include: { 
                model: MesaExamen, 
                through: MesaAlumno } 
            })
        );
    }

    static async findAlumnoById(id) {
        const alumno = await Alumno.findByPk(id, { 
            include: { 
                model: MesaExamen, through: MesaAlumno 
            },
        });
        if (!alumno) {
            throw new AppError('El alumno especificado no se encuentra', 404);
        }
        return alumno;
    }

    static async findAlumnoByNroIden(nro_identidad) {
        return await Alumno.findOne({ where: 
            { 
                nro_identidad: nro_identidad.toString()    
            } 
        });
    }

    static async findAlumnosDataFromMesaAlumno(idMesa) {
        const mesaAlumnosData= await MesaAlumno.findAll({
            where: { id_mesa: idMesa },
            attributes: ['id_estudiante', 'inscripto', 'presente', 'carrera', 'plan', 'codigo', 'calidad', 'nota'],
        });

        if (!mesaAlumnosData || mesaAlumnosData.length === 0) {
            throw new AppError('No se encontraron estudiantes para esta mesa', 404);
        }

        return mesaAlumnosData;
    }

    static async findAllAlumnos(alumnosIds){
        const alumnos = await Alumno.findAll({
            where: {
                id_estudiante: alumnosIds, 
            },
            attributes: ['id_estudiante', 'nombre_completo', 'lu', 'doc', 'nro_identidad'], 
        });

        if (!alumnos || alumnos.length === 0) {
            throw new AppError('Alumnos no encontrados', 404);
        }

        return alumnos
    }

    static async mapAlumnosDataWithMesaAlumnos(alumnosData,mesaAlumnosData){
        return alumnosData.map(alumno => {
            const alumnoData = mesaAlumnosData.find(ed => ed.id_estudiante === alumno.id_estudiante);
            return {
                ...alumno.toJSON(),
                carrera: alumnoData.carrera,
                calidad: alumnoData.calidad,
                plan: alumnoData.plan,
                codigo: alumnoData.codigo,
                inscripto: alumnoData.inscripto,
                presente: alumnoData.presente,
                nota: alumnoData.nota,
            };
        });
    }

    static async getAlumnosByIdMesaExamen(id_mesa, id_profesor){
        await MesaExamenService.validateProfesorMesa(id_profesor, id_mesa);
        const mesaAlumnosData = await this.findAlumnosDataFromMesaAlumno(id_mesa);
        const estudiantesIds = mesaAlumnosData.map((ed) => ed.id_estudiante);
        const alumnos = await this.findAllAlumnos(estudiantesIds);
        const result = await this.mapAlumnosDataWithMesaAlumnos(alumnos, mesaAlumnosData);
        
        return result
    }
}


module.exports = AlumnoService;
