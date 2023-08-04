let map = L.map('map').
setView([-2.1969, -79.8862],
15);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
maxZoom: 18
}).addTo(map);

L.control.scale().addTo(map);

L.marker([-77.5000000 , -2.0000000],{draggable: true}).addTo(map);
// -2.20283, -79.89408 istg

document.getElementById('seleccion_destino').addEventListener('change',(e)=>{
  let coords = e.target.value.split(",");
  console.log(coords)  
  map.flyTo(coords,18)
  L.marker(coords).addTo(map)
})

// Capturar la posición actual del usuario y marcarlo en el mapa

// Obtener referencia al elemento en el DOM
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  
  function showPosition(position) {
    let latitud = position.coords.latitude;
    let longitud = position.coords.longitude;
    alert( position.coords.latitude +
    "," + position.coords.longitude);
 
     map.flyTo([latitud,longitud],18)
    L.marker([latitud,longitud]).addTo(map)
  }