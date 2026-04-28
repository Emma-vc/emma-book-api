// Importamos el modelo y la vista de las editoriales
const publishersModel = require('../models/publishersModel');
const publishersView = require('../views/responseFormatter');

// Controlador para obtener todos las editoriales
const publishersController = {
    getPublishers: () => {
        const publishers = publishersModel.getAll()//obtiene toda la lista de las editoriales
        return publishersView.responseFormatter(publishers);
    },
    // agrega una nueva editorial
    addPublishers: (newPublisher) => {
        try {
            const resultado = publishersModel.add(newPublisher);
            return publishersView.responseFormatter(resultado);
        //si hay un error en el bloque anterior lo agarra el catch y da mensaje de error
        } catch (error) {
            return publishersView.responseFormatter({
              status: error.status || 400,// el error es el status del model sino lo tiene usa el 400
              error: error.message 
            });
        }  
    },

    // Mostrar editoriales x id
    getPublisherById: (id) => {
        try {
            const publisher = publishersModel.getById(id);
            return publishersView.responseFormatter(publisher);
        } catch (error) {
            return publishersView.responseFormatter({
              status: error.status || 400,
              error: error.message 
            });
        }
    },

    // Borrar editorial x id
    deletePublisher: (id) => {
        try {
            const resultado = publishersModel.delete(id);
            return publishersView.responseFormatter(resultado);
        } catch (error) {
            return publishersView.responseFormatter({ 
              status: error.status || 400,
              error: error.message 
            });
        }
    }     
}

// Exportamos el controlador para que pueda ser utilizado en otras partes de la aplicación
module.exports = publishersController;