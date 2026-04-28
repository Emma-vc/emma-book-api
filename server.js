  //importamos modulo net
const net = require('node:net');

   // importamos los controladores
const authorsController = require('./controllers/authorsControllers.js')
const booksController = require('./controllers/booksControllers.js')
const publishersController = require('./controllers/publishersController.js')

   //creamos el servidor
const server = net.createServer();

    //conectamos
server.on('connection', (socket) => {
    console.log('\n🔗 Nuevo cliente conectado');

    //configuracion para pasar a string
    socket.setEncoding('utf-8');

    //cliente envia datos
    socket.on('data', (data) => {
        const mensaje = data.trim();
        console.log('\n🔹 Cliente dice:', mensaje);
        //saca el comando y el resto de los argumentos en un array arg 
        const [comando, ...args] = mensaje.split(' ');

    let respuesta;

    try {//usamos un swich case segun la peticion del cliente
        switch (comando) {

           //--- caso agregar un libro con sus propiedades ---
           case 'ADD_FULL_BOOK': { 
                 //partes es array contiene args lo paso a string y se separan x guion medio  
                const partes = args.join(' ').split('-');
                if (partes.length < 5) {
                    throw new Error(
                'Formato inválido!! Usa: tituloLibro - autor- nacionalidadAutor - editorial- pais la editorial');
                }
                const [titulo, autorNombre, country, publisherNombre, publisherCountry] = partes;

                // valida para q si o si esten todas las propiedades
                if (
                        !titulo?.trim() ||
                        !autorNombre?.trim() ||
                        !country?.trim() ||
                        !publisherNombre?.trim() ||
                        !publisherCountry?.trim()
                    ) {
                        throw new Error('Todos los campos son obligatorios');
                    }
                //-- crea al autor   
                const autor = authorsController.addAuthors({
                    name: autorNombre.trim(),
                    country: country.trim()
                });
                if (autor.error) throw new Error(autor.error);
                // -- crea la edit
                const publisher = publishersController.addPublishers({
                    name: publisherNombre.trim(),
                    country: publisherCountry.trim()
                });
                if (publisher.error) throw new Error(publisher.error);
                // --- crea el libro
                const libro = booksController.addBooks({
                    title: titulo.trim(),
                    authorId: autor.data.id,
                    publisherId: publisher.data.id
                });
                // el server le manda al cliente el objeto creado
                respuesta = { autor, publisher, libro };

                break; 
            }
          //----- casos de authors ------
            case 'GET_AUTHORS':
                respuesta = authorsController.getAuthors();
                break;
            case 'GET_AUTHOR':
                if (!args[0]) {
                    throw new Error('Falta el ID del autor');
                }
                respuesta = authorsController.getAuthorById(args[0]);
                break;

            case 'ADD_AUTHOR':{ 
                const partes = args.join(' ').split('-');
                if (partes.length !== 2) {
                    throw new Error('Formato inválido! Usa: nombreAutor-nacionalidadAutor');
                }
                const [name, country] = partes;
                if (!name.trim() || !country.trim()) {
                    throw new Error('Nombre y país no pueden estar vacíos');
                }

                respuesta = authorsController.addAuthors({
                    name: name.trim(),
                    country: country.trim()
                });

                break;
            }                 
            case 'DELETE_AUTHOR':
                if (!args[0]) {
                    throw new Error('Falta el ID del autor');
                }// si el cliente se olvido de poner el id manda error sino continua
                respuesta = authorsController.deleteAuthor(args[0]);
                break;
               
          //----- casos de book -------
            case 'GET_BOOKS':
                respuesta = booksController.getBooks();
                break;
            case 'GET_BOOK':
                if (!args[0]) {//validacion si no puso id
                    throw new Error('Falta el ID del libro');
                }
                respuesta = booksController.getBookById(args[0]);
                break;
            
            case 'ADD_BOOK': { 
                const partes = args.join(' ').split('-');
                if (partes.length < 3) {
                    throw new Error('Formato inválido. Usa: titulo-authorId-publisherId');
                }
                 // serian propiedades en bruto u originales q despues validamos
                const [titleRaw, authorIdRaw, publisherIdRaw] = partes;

                // validacion de titulo quita espacios
                if (!titleRaw.trim()) {
                    throw new Error('El titulo no puede estar vacio');
                }

                // si no esta el id del autor o editorial sale msj de error
                if (!authorIdRaw.trim() || !publisherIdRaw.trim()) {
                    throw new Error('authorId y publisherId no pueden estar vacíos');
                }

                // el id original de string pasa a numero
                const authorId = Number(authorIdRaw);
                const publisherId = Number(publisherIdRaw);
                // pero si ingreso letras y no un numero en string el number no es suficiente y necesita validar con isnan
                // validacion con isNaN
                if (isNaN(authorId) || isNaN(publisherId)) {
                    throw new Error('authorId y publisherId deben ser numeros validos');
                }
                // valida q los id ingresados sean enteros 😑
                if (!Number.isInteger(authorId) || !Number.isInteger(publisherId)) {
                    throw new Error('authorId y publisherId deben ser enteros');
                }

                // La respuesta validada, limpia
                respuesta = booksController.addBooks({
                    title: titleRaw.trim(),
                    authorId,
                    publisherId
                });

                break;
            }
           
            case 'DELETE_BOOK':
                if (!args[0]) {
                    throw new Error('Falta el ID del libro');
                }
                respuesta = booksController.deleteBook(args[0]);
                break;

        // ----- casos de publisher -----
            case 'GET_PUBLISHERS':
                respuesta = publishersController.getPublishers();
                break;
            case 'GET_PUBLISHER':
                if (!args[0]) {
                    throw new Error('Falta el ID de la editorial');
                }
                respuesta = publishersController.getPublisherById(args[0]);
                break;
            case 'ADD_PUBLISHER':{ 
                const partes = args.join(' ').split('-');

                if (partes.length !== 2) {
                    throw new Error('Formato inválido! Usa: nombreEditorial- paisEditorial');
                }

                const [name, country] = partes;

                if (!name.trim() || !country.trim()) {
                    throw new Error('Editorial y país no pueden estar vacíos');
                }

                respuesta = publishersController.addPublishers({
                    name: name.trim(),
                    country: country.trim()
                });

                break;
            }
            case 'DELETE_PUBLISHER':
                if (!args[0]) {
                    throw new Error('Falta el ID de la editorial');
                }
                respuesta = publishersController.deletePublisher(args[0]);
                break;

            default:
                respuesta = { error: 'Comando no valido' };
        }


    } catch (error) {
        respuesta = {
        status: error.status || 500,
        error: error.message
        }; 
    }
    // el objeto lo paso a string y envio al cliente los datos
    socket.write(JSON.stringify(respuesta) + '\n');
});
    
    // si el cliente cierra su conexion 
    socket.on('end', () => {
        console.log('\n🔌 Cliente se desconectó');
    });
    // nosotros terminamos la conexion
    socket.on('close', () => {
        console.log('\n🔐 Conexión cerrada definitivamente\n');
    });

    socket.on('error', (err) => {
        console.log('⚠️ Error en el socket:', err.message);
    });
});

    // manejo de errores del servidor
server.on('error', (err) => {
    console.error('❌ Error en el servidor:', err.message);
});

    //servidor escucha el puerto 8080    
server.listen(8080, () => {
    console.log('\n🚀 Servidor TCP escuchando en el puerto 8080');
}); 