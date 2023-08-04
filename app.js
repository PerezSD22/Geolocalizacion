let map = L.map('map')
  .setView([-2.1969, -79.8862], 15);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
}).addTo(map);

L.control.scale().addTo(map);

// Variable para almacenar el marcador de la posición actual
let marcadorPosicionActual = null;

// Variable para almacenar el marcador del destino seleccionado
let marcadorDestino = null;

// Variable para almacenar la polilínea entre la posición actual y el destino
let polilinea = null;

// Variable para almacenar el intervalo de animación
let animationInterval = null;

// Función para crear una polilínea entre dos puntos
function crearPolilinea(coords1, coords2) {
  const polylineOptions = { color: 'white', opacity: 1 };
  polilinea = L.polyline([coords1, coords2], polylineOptions).addTo(map);
}

// Función para animar el movimiento del marcador hacia el destino
function animarMovimiento(destino) {
  const velocidad = 0.0002; // Ajusta la velocidad de la animación
  const posicionActual = marcadorPosicionActual.getLatLng();
  const latDiff = destino.lat - posicionActual.lat;
  const lngDiff = destino.lng - posicionActual.lng;


  let i = 0;


animationInterval = setInterval(() => {
    i += velocidad;
  
    if (i >= 1) {
      // Detener la animación y establecer la posición final del marcador
      clearInterval(animationInterval);
      marcadorPosicionActual.setLatLng(destino);
  
      // Eliminar la polilínea
      if (polilinea) {
        map.removeLayer(polilinea);
        polilinea = null;
      }
  
      return;
    }
  
    // Eliminar la polilínea anterior y crear una nueva en cada iteración
    if (polilinea) {
      map.removeLayer(polilinea);
      polilinea = null;
    }
  
    const newLat = posicionActual.lat + (latDiff * i);
    const newLng = posicionActual.lng + (lngDiff * i);
    const newPosition = L.latLng(newLat, newLng);
    marcadorPosicionActual.setLatLng(newPosition);
  
    // Crear la nueva polilínea entre la posición actual y el destino
    crearPolilinea(newPosition, destino);
  }, 20); // Ajusta el tiempo del intervalo para suavizar la animación
}

// Evento cuando se selecciona una opción en el elemento 'seleccion_destino'
document.getElementById('seleccion_destino').addEventListener('change', (e) => {
  // Obtener las coordenadas del destino seleccionado
  const coords = e.target.value.split(",");
  console.log(coords);

  // Eliminar el marcador de destino anterior, si existe
  if (marcadorDestino) {
    map.removeLayer(marcadorDestino);
  }

  // Crear y agregar el nuevo marcador de destino
  marcadorDestino = L.marker(coords).addTo(map);

  // Crear la polilínea entre la posición actual y el destino
  if (marcadorPosicionActual) {
    const coords1 = marcadorPosicionActual.getLatLng();
    const coords2 = marcadorDestino.getLatLng();
    crearPolilinea(coords1, coords2);

    // Animar el movimiento hacia el destino
    animarMovimiento(coords2);
  }

  // Volar hacia el destino seleccionado con un nivel de zoom 18
  map.flyTo(coords, 18);
});

// Capturar la posición actual del usuario y marcarlo en el mapa
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

// Función para mostrar la posición actual en el mapa
function showPosition(position) {
  const latitud = position.coords.latitude;
  const longitud = position.coords.longitude;
  console.log(latitud + "," + longitud);

  // Eliminar el marcador de posición actual anterior, si existe
  if (marcadorPosicionActual) {
    map.removeLayer(marcadorPosicionActual);
  }

  // Crear y agregar el nuevo marcador de posición actual
  marcadorPosicionActual = L.marker([latitud, longitud], { draggable: true }).addTo(map);

  // Crear la polilínea entre la posición actual y el destino, si existe
  if (marcadorDestino) {
    const coords1 = marcadorPosicionActual.getLatLng();
    const coords2 = marcadorDestino.getLatLng();
    crearPolilinea(coords1, coords2);

    // Animar el movimiento hacia el destino
    animarMovimiento(coords2);
  }

  // Volar hacia la posición actual con un nivel de zoom 18
  map.flyTo([latitud, longitud], 18);
}

// Llamar a la función para obtener la ubicación del usuario
getLocation();

