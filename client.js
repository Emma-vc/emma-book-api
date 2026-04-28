    // importamos el modulo net y readline
const net = require('node:net');
const readline = require('node:readline');

    // creamos conexion con el servidor
const cliente = net.createConnection({ port: 8080, host: 'localhost' });

    // usamos encoding para configurar codificacion
cliente.setEncoding('utf-8');

    //creamos la interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
 //  define el msj
rl.setPrompt('\n➡️  Escribí el comando (o "salir"): ');

    //escucha lo q escribe el usuario
rl.on('line', (input) => {
    //toma la primera palabra del input (el comando), elimina espacios extra y la convierte a mayusculas
  const comando = input.trim().split(' ')[0].toUpperCase();
  // elimina el comando del input y se queda con el resto como string ( q serian los args)
  const args = input.trim().substring(comando.length).trim();
  
    if (comando === 'SALIR') {
     console.log('\n\tSaliendo...... 🫡 🫡 🫡 ');
     cliente.end();
     rl.close();
     return;
    }
    //validacion para q el cliente no escriba cualquier cosa, tiene q empezar con get, add etc
    if (
        !comando.startsWith('GET_') &&
        !comando.startsWith('ADD_') &&
        !comando.startsWith('DELETE_')
    ) {
        console.log('⚠️  Comando inválido!! Usa GET_, ADD_ o DELETE_');
        rl.prompt();
        return;
    }
    //operador ternario:Si args tiene contenido, agrega un espacio ' ' seguido de args. Si no tiene contenido, agrega una cadena vacía.
    const mensajeFinal = comando + (args.length ? ' ' + args : '');
    //seria el comando en mayuscula y el resto en minuscula
    cliente.write(mensajeFinal); //  envia al servidor    
});

    // evento 'connect' cuando la conexion se establece correctamente
cliente.on('connect', () => {
    console.log('\n🔌 Conectado al servidor ♾️');
        //muestra el mensaje
    rl.prompt();
});

    // evento 'data' para recibir mensajes del servidor
cliente.on('data', (data) => {
  try {
    const respuesta = JSON.parse(data);
    console.log('\n📩 Datos recibidos del servidor:', respuesta);
  } catch (err) {
    console.log('⚠️ Error al parsear respuesta:', data);
  }
  rl.prompt();//sigue preguntando
});

//cierre de conexión
cliente.on('end', () => {
    console.log('\n❌ Conexion cerrada');
});

cliente.on('close', () => {
    console.log('🔒 Conexion cerrada completamente');
});
    // manejo de errores
cliente.on('error', (err) => {
    console.log('⚠️ Error en la conexion:', err.message);
});