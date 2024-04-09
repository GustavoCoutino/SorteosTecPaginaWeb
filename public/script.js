document.addEventListener('DOMContentLoaded', function () {
    fetch('/datos')
      .then(response => response.json())
      .then(data => {
        // Manipular los datos recibidos y actualizar la interfaz de usuario
        console.log('Datos de la base de datos:', data);
      })
      .catch(error => console.error('Error al obtener datos:', error));
  });


