const fs = require('node:fs');//modulo nativo de node maneja archivos
const path = require('node:path');//modulo nativo de node maneja rutas

//une el directorio con archivo
const ruta = path.join(__dirname, '../data/authors.json');

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
const AuthorsModel = {

  // Obtener todos(lista)
  getAll: () => {
    return leerArchivo();
  },

  //busca autores x id
  getById: (id) => {
  const authors = leerArchivo();
  const author= authors.find(a => a.id === Number(id));
  //si no existe da error
  if (!author) {
    const error = new Error('Autor no encontrado');
    error.status = 404;
    throw error;
  }
  return author;
  },

  //borra autores x id
  delete: (id) => {
  const authors = leerArchivo();
  const filtrados = authors.filter(a => a.id !== Number(id));
  //crea un nuevo array sacando al id que se quiere eliminar

  // compara los 2 array si tienen la misma longitud no se filtro nada o sea que no existia ese id 
  if (authors.length === filtrados.length) {
      const error = new Error('Autor no encontrado');
      error.status = 404;
      throw error;
  }

  escribirArchivo(filtrados);//guarda cambios
  return { message: 'Autor eliminado' };
  },      

  // Agregar autor 
  add: (newAuthor) => {
  const authors = leerArchivo();

  //validacion si faltan datos
  if (!newAuthor.name || !newAuthor.country) {
      const error = new Error('Faltan datos del autor');
      error.status = 400;
      throw error;   
  } 

  const id = generarId(authors);//genera su id

  //creamos el nuevo autor
  const nuevo = {
  id,
  name: newAuthor.name,
  country: newAuthor.country
};

  authors.push(nuevo);//agrega a la lista autores 
  escribirArchivo(authors);//guarda cambios

  return nuevo;
}
};

module.exports=AuthorsModel;