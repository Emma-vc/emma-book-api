//Importamos el modulo nativo 'fs' para trabajar con el sistema de archivos
const fs = require('node:fs');
const path = require('node:path');//modulo nativo de node maneja rutas

// Definimos la ruta al archivo JSON donde se almacenarán los libros
const ruta = path.join(__dirname, '../data/publishers.json');

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

//genero id para editoriales
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
const PublishersModel = {

  // Obtener todos(lista)
  getAll: () => {
    return leerArchivo();
  },

  //busca editoriales x id
  getById: (id) => {
  const publishers = leerArchivo();

  const publisher=publishers.find(p => p.id === Number(id));
  if (!publisher) {
      const error = new Error('Editorial no encontrada');//este error es el mensaje del catch
      error.status = 404;
      throw error; 
    }

   return publisher;
  },

  //eliminar editorial x id
  delete: (id) => {
  const publishers = leerArchivo();
  const filtrados = publishers.filter(p => p.id !== Number(id));
  //crea un nuevo array sacando al id que se quiere eliminar

  // compara los 2 array si tienen la misma longitud no se filtro nada o sea que no existia ese id 
  if (publishers.length === filtrados.length) {
    const error = new Error('Editorial no encontrada');//este error es el mensaje del catch
    error.status = 404;
    throw error; 
  }

  escribirArchivo(filtrados);//guarda cambios
  return { message: 'Editorial eliminada' };
  },      

  // Agregar una nueva editorial  
  add: (newPublisher) => {
  const publishers = leerArchivo();

  //validacion si faltan datos o hay un espacio vacio
  if (!newPublisher || !newPublisher.name?.trim() || !newPublisher.country?.trim()){ 
    const error = new Error('Faltan datos de la editorial');
    error.status = 400;
    throw error;
  }
  
  const id = generarId(publishers);//genera su id

  //creamos el nuevo objeto editorial con sus propiedades
  const nuevo = {
  id,
  name: newPublisher.name,
  country: newPublisher.country
  };

  publishers.push(nuevo);//agrega a la lista editoriales 
  escribirArchivo(publishers);//guarda cambios

  return nuevo;
}
};
// Exportamos el modelo para que pueda ser utilizado en otras partes de la aplicación
module.exports=PublishersModel;