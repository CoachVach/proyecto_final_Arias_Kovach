const ColaboradorMesa = require('../models/colaborador_mesa');
const ProfesorService = require('../services/profesorService'); 
const MesaExamenService = require('../services/mesaExamenService');
const AppError = require('../structure/AppError');
const MesaExamen = require('../models/mesa_examen');
const { Op } = require('sequelize');

class ColaboradorMesaService{

    static async addColaborador(listaColaboradores, mesaID, io){
        for (const colab of listaColaboradores ){
            let profesor = await ProfesorService.verifyProfessor(colab);
            if (!profesor) {
                await MesaExamenService.deleteMesa(newMesa);
                throw new AppError('Uno de los mails proporcionados no pertenecen a un profesor registrado', 404);
            }
            await ColaboradorMesa.create({
                id_profesor: profesor.id_profesor,
                id_mesa: mesaID
            });
            // Emitir evento de actualización a todos los clientes
            io.to(`profesor_${profesor.email}`).emit('mesasParaColabActualizadas', { id_mesa: mesaID });
        }
    }

    static async findMesasByColaborador(idColaborador){
        const idMesas = await ColaboradorMesa.findAll({ where: { id_profesor: idColaborador } });
        let mesas=[]; 
        if (idMesas && idMesas.length > 0) {
            mesas = await MesaExamen.findAll({
                where: {
                    id_mesa: {
                        [Op.in]: idMesas.map(idMesa => idMesa.id_mesa)
                    }
                }
            });
        }
        return mesas;
    } 
}

module.exports = ColaboradorMesaService;