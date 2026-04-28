//Importamos el modulo nativo 'fs' para trabajar con el sistema de archivos
const fs = require('node:fs');
const path = require('node:path');//modulo nativo de node maneja rutas

// Definimos la ruta al archivo JSON donde se almacenarán los libros
const ruta = path.join(__dirname, '../data/books.json');

// Funciones para leer y escribir los libros desde el archivo JSON
function leerArchivo() {
  try{ 
    if (!fs.existsSync(ruta)) {
      // Si el archivo no existe, crea el array
      fs.writeFileSync(ruta, JSON.stringify([], null, 2));
      return [];
    }
    const contenido = fs.readFileSync(ruta, 'utf8');
     //si el json esta vacio
    if (!contenido.trim()) return [];

    return JSON.parse(contenido);

   }catch (error) {
    console.error('Error leyendo archivo:', error.message);
    return []; 
  }
}

function escribirArchivo(data) {
  try {
    fs.writeFileSync(ruta, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error escribiendo archivo:', error.message);
  } 
}

//genero id para autores
function generarId(lista) {
  if (lista.length === 0) return 1;// si no hay nada en la lista empieza con 1

  let maxId = 0; // empieza en 0 pero va a guardar el valor mas alto de id 
  for (const item of lista) {
    if (item.id > maxId) {//compara si el valor del id actual es mayor al maxId
      maxId = item.id;    //entonces max id toma y guarda ese valor 
    }
  }

  return maxId + 1;// al valor del id que tenga maxId le sumo 1 y ese va a ser el nuevo id
}  

//  objeto MODEL
const BooksModel = {

  // Obtener todos(lista)
  getAll: () => {
    return leerArchivo();
  },

  //busca libros x id
  getById: (id) => {
  const books = leerArchivo();
  const book=books.find(b => b.id === Number(id));
  if (!book) {
    const error = new Error('Libro no encontrado');//este error es el mensaje del catch
    error.status = 404;
    throw error;     
    }

   return book;
  },

  //borra libros x id
  delete: (id) => {
  const books = leerArchivo();
  const filtrados = books.filter(b => b.id !== Number(id));
  //crea un nuevo array sacando al id que se quiere eliminar

  // compara los 2 array si tienen la misma longitud no se filtro nada o sea que no existia ese id 
  if (books.length === filtrados.length) {
      const error = new Error('Libro no encontrado');
      error.status = 404;
      throw error;   
  }

  escribirArchivo(filtrados);//guarda cambios
  return { message: 'Libro eliminado' };
  },      

  // Agregar un nuevo libro 😁 
  add: (newBook) => {
  const books = leerArchivo();

  //validacion si faltan datos
  if (!newBook.title || !newBook.authorId || !newBook.publisherId) {
     const error = new Error('Faltan datos del libro');
     error.status = 400;
     throw error;    
  } 

  const id = generarId(books);//genera su id

  //creamos el nuevo objeto libro con sus propiedades
  const nuevo = {
  id,
  title: newBook.title,
  authorId: Number(newBook.authorId),
  publisherId: Number(newBook.publisherId)
};

  books.push(nuevo);//agrega a la lista libros 
  escribirArchivo(books);//guarda cambios

  return nuevo;
}
};
// Exportamos el modelo para que pueda ser utilizado en otras partes de la aplicación
module.exports=BooksModel;