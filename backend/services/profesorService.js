const Profesor = require('../models/profesor');

class ProfesorService{
    static async verifyProfessor(email){
     return await Profesor.findOne({ where: { email } });
    } 
}

module.exports = ProfesorService;