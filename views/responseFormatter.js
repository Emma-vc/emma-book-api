const responseFormatter = (response) => {
  
  // Si ya viene con error
  if (response?.error) {
    return {
      status: response.status || 400,
      error: response.error
    };
  }

  // Respuesta exitosa, devuelve los datos que contiene la respuesta data 
  return {
    status: 200,
    data: response
  };
};

module.exports = { responseFormatter };