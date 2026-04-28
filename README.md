# emma-book-api

📚 Trabajo integrador: Biblioteca (Patrón MVC)
El proyecto se trata de una biblioteca digital que sigue el patrón MVC
El modelo tiene toda la lógica y creación de archivos y funciones que gestionan los datos Json.
El controlador interpreta los comandos que recibe el servidor, conecta con los modelos y prepara la respuesta
La vista devuelve la respuesta al cliente en formato Json.
Cliente/servidor el cliente envía comandos, el servidor los procesa, recibe los datos de la vista y los muestra en consola.

Comandos Disponibles:

🔹AGREGAR
→ Agregar un libro con Comando + propiedades separadas por un guion medio
ADD_FULL_BOOK tituloLibro - autor- nacionalidadAutor - editorial- pais la editorial

→ Agregar autor/libro o editorial Comando + sus propiedades
ADD_AUTHOR nombreAutor - nacionalidadAutor
ADD_BOOK titulo-authorId-publisherId
ADD_PUBLISHER nombreEditorial- paisEditorial

🔹 LISTAR
→ Listar todos los autores o libros o editoriales solo se utiliza el comando
GET_AUTHORS
GET_BOOKS
GET_PUBLISHERS

→ Listar el autor/libro o editorial x id Comando + Id
GET_AUTHOR numeroId
GET_BOOK numeroId
GET_PUBLISHER numeroId

🔹 ELIMINAR
→ Borrar autor/libro o editorial x id Comando + id
DELETE_AUTHOR idAutor
DELETE_BOOK idLibro
DELETE_PUBLISHER idEditorial

Ej de Flujo de interacción: 
➡️  Escribí el comando (o "salir"): get_book 12

📩 Datos recibidos del servidor: {
  status: 200,
  data: {
    id: 12,
    title: 'Viaje al centro de la tierra',
    authorId: 12,
    publisherId: 12
  }
}

Y para salir es así: 
➡️  Escribí el comando (o "salir"): salir
        Saliendo...... 🫡 🫡 🫡 
❌ Conexion cerrada
🔒 Conexion cerrada completamente

