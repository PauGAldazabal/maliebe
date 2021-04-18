//----------------------------------READY----------------------------------//
$(document).ready(function () {
  $("#notificacion").html(`<div class="spinner-border text-secondary" role="status">
                            <span class="sr-only">Loading...</span>
                           </div>`);  
});

//----------------------------------LOAD----------------------------------// 
window.addEventListener('load', () => {
  console.log("Se cargaron todos los elementos de la página.");
  
  $("#notificacion").html(`<div class="heading">
                            MĀLIE BE
                           </div>`);  
})

$("#notificacion").fadeOut(5000);

//----------------------------------MAIN----------------------------------//
let productos = [];

$.getJSON('data/productos.json', function(datos, estado) {
	productos = datos;
	console.log(estado);
	console.log(productos);
	if (estado == 'success') {
		cargarProductos();
		cargarSelect();
	}
});

let SELECCIONADOS = [];

$('#cantidad-selección').on('keyup', calcularSubtotal);

$('#botón-selección-comprar').on('click', respuestaClickSelecciónComprar);

let modal = document.getElementById('mensaje-final');











