// Importamos el modelo y la vista del libro
const authorsModel = require('../models/authorsModel');
const authorsView = require('../views/responseFormatter');

// Controlador para obtener todos los autores
const authorsController = {
    getAuthors: () => {
        const authors = authorsModel.getAll()//obtiene toda la lista de los autores
        return authorsView.responseFormatter(authors);
    },
    // agrega autor nuevo
    addAuthors: (newAuthor) => {
        try {
            const resultado = authorsModel.add(newAuthor);
            return authorsView.responseFormatter(resultado);
        } catch (error) {
            return authorsView.responseFormatter({
                status: error.status || 400,// el error es el status del model sino lo tiene usa el 400
                error: error.message
        });
        }
    },  
    // Mostrar autor x id
    getAuthorById: (id) => {
        try {
            const author = authorsModel.getById(id);
            return authorsView.responseFormatter(author);
        } catch (error) {
            return authorsView.responseFormatter({
                status:error.status || 400,
                error: error.message
         });
        }
    },
   
    // Borrar autor x id
    deleteAuthor: (id) => {
        try {
            const resultado = authorsModel.delete(id);
            return authorsView.responseFormatter(resultado);
        } catch (error) {
            return authorsView.responseFormatter({
                status: error.status || 400,
                error: error.message
        });
        }
    }   
};

// Exportamos el controlador para que pueda ser utilizado en otras partes de la aplicación
module.exports = authorsController;