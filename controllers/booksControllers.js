// Importamos el modelo y la vista del libro
const booksModel = require('../models/booksModel');
const booksView = require('../views/responseFormatter');

// Controlador para obtener todos los libros
const booksController = {
    getBooks: () => {
        const books = booksModel.getAll()//obtiene toda la lista de los libros
        return booksView.responseFormatter(books);
    },
    // agrego libro nuevo
    addBooks: (newBook) => {
        try {
            const resultado = booksModel.add(newBook);
            return booksView.responseFormatter(resultado);
        } catch (error) {
            return booksView.responseFormatter({
              status: error.status || 400,// el error es el status del model sino lo tiene usa el 400
              error: error.message });
        }
    },
   
    // Mostrar libro x id
    getBookById: (id) => {
        try {
            const book = booksModel.getById(id);//en el model no lo encontro se va hacia catch
            return booksView.responseFormatter(book);
        } catch (error) {
            return booksView.responseFormatter({ 
                status:error.status || 400,
                error: error.message
             });//se ve el msj del model
        }
    },
   
    // Borrar libro x id
    deleteBook: (id) => {
        try {
            const resultado = booksModel.delete(id);
            return booksView.responseFormatter(resultado);
        } catch (error) {
            return booksView.responseFormatter({ 
                status:error.status || 400,
                error: error.message });
        }
    }      
};

// Exportamos el controlador para que pueda ser utilizado en otras partes de la aplicación
module.exports = booksController;