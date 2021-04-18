//----------------------------------FUNCIONES----------------------------------//
function cargarProductos() {
	for (const producto of productos) {
		$('.col-md-4').append(`<div>
					<img src="${producto.img}" alt="${producto.alt}" width="33%" height="auto" id="${producto.id}">
					<div class="desc">
					<span style="font-size:24px"><strong>${producto.nombre}</strong></span>
					<br>
					<span style="font-size:20px">$${producto.precio}</span>
					<br>
					<i>${producto.características}</i>
					<br>
					<button class="agregar-al-carrito" onclick="respuestaClickAgregar(${producto.id})" id=${producto.id}>¡LO QUIERO!</button>
					</div>
					</div>`);
	}
}


function cargarSelect() {
	// DROPDOWN PRODUCTOS
	for (const producto of productos) {
		$('#productos-listados').append(`<option value="${producto.id}">VELA ${producto.nombre} - Línea ${producto.línea} - ID: ${producto.id}</option>`);
	}
}


function respuestaClickAgregar(idProducto) {
	let posicionamiento = $("#selección").offset().top;
  	$("html, body").animate({scrollTop: posicionamiento}, 1000);

  	// FILTRAR DROPDOWN POR ID	
	let buscarProductoElegido = productos.find(elemento => elemento.id == idProducto);
	console.log(buscarProductoElegido);

	// AGREGAR AL DROPDOWN LA OPCIÓN ELEGIDA
	function setSelectedIndex(s, i) {
	s.options[i-1].selected = true;
	return;
	}
	setSelectedIndex(document.getElementById('productos-listados'),idProducto);

	// AGREGAR PRECIO CORRESPONDIENTE
	function agregarPrecio() {
		document.getElementById('precio-selección').value = buscarProductoElegido.precio; 
	}
	agregarPrecio();

	// BORRAR CANTIDAD Y SUBTOTAL DE PRODUCTO ANTERIOR
	$('#cantidad-selección').val('');
	$('#subtotal-selección').val('');
}


// AGREGAR PRODUCTOS DESDE EL DROPDOWN
function agregarPrecioDesdeDropdown() {
		// IDENTIFICAR PRODUCTO EN EL DROPDOWN
		let seleccionarOpción = document.getElementById('productos-listados');
		let seleccionarValor = seleccionarOpción.options[seleccionarOpción.selectedIndex].value;
		console.log(seleccionarValor);
		// AGREGAR PRECIO CORRESPONDIENTE
		let buscarProductoSeleccionado = productos.find(elemento => elemento.id == seleccionarValor);
		//console.log(buscarProductoSeleccionado);
		$('#precio-selección').val(buscarProductoSeleccionado.precio);
		$('#cantidad-selección').val('');
		$('#subtotal-selección').val('');
}


// MODIFICAR SUBTOTAL EN BASE A LA CANTIDAD DE PRODUCTOS INGRESADOS:
function calcularSubtotal() {
	for (const producto of productos) {
		producto.unidad = document.getElementById('cantidad-selección').value;
		document.getElementById('subtotal-selección').value = document.getElementById('precio-selección').value * producto.unidad;
	}
}


// BOTÓN AGREGAR
function respuestaClickSelecciónComprar(e) {
	e.preventDefault();
	let cantidadSlección = parseInt($('#cantidad-selección').val());
	if (cantidadSlección > 0) {
		$('#mensaje-error').hide();
		//VER SI EL PRODUCTO YA ESTA EN EL CARRITO CON FIND
		let idSeleccionado = document.getElementById('productos-listados').value;
		let chequearProducto = SELECCIONADOS.find(elemento => elemento.id == idSeleccionado);
		if (chequearProducto != undefined) {
			//ESTA EN EL CARRITO, ENTONCES NO ES NECESARIO BUSCAR LA INFORMACION EN EL ARRAY DE DATOS, SUMAMOS UNA CANTIDAD
			chequearProducto.agregarUnidad();
			chequearProducto.actualizarPrecioFinal();
		} else {
			//NO ESTA EN EL CARRITO, ENTONCES LO BUSCAMOS EN EL ARRAY DE DATOS
			let idSeleccionado = document.getElementById('productos-listados').value;
			console.log(idSeleccionado);
			let productoSeleccionado = productos.find(elemento => elemento.id == idSeleccionado);
			console.log(productoSeleccionado);
			//let productoSeleccionado = productos.find(elemento => elemento.id == e.target.id);
			SELECCIONADOS.push(new Producto(productoSeleccionado));
		}
		console.log(SELECCIONADOS);

		generarCarritoProductos();

		$('#cantidad-selección').val('');
		$('#subtotal-selección').val('');
	} else {
		$('#mensaje-error').show();
	}
}


// RENDER CARRITO (SALIDA DEL CARRITO SEGUN LA INFORMACION DEL ARRAY DE SELECCIONADOS)
function generarCarritoProductos() {
	$('#resumen-productos').html(`<table id="tabla-carrito">
					<thead>
					<tr>
					<th>PRODUCTO</th>
					<th>PRECIO</th>
					<th>CANTIDAD</th>
					<th>SUBTOTAL</th>
					<th></th>
					</tr>
					</thead>
					<tbody id="table-body-carrito"></tbody>
					</table>`);
	
	let iconoEliminarProducto = `<svg id="trash" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    					<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    					<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  					</svg>`;

  	let total = 0;

  	for (const producto of SELECCIONADOS) {
  		$('#table-body-carrito').append(`<tr id="productos-listados-tabla">
  						    <td>${producto.nombre}</td>
						    <td id="precios">$${producto.precio}</td>
						    <td id="unidades">${producto.unidad}</td>
						    <td>$${producto.obtenerSubtotal()}</td>
						    <td><span id="eliminar-de-carrito" onclick="eliminar(${producto.id})">${iconoEliminarProducto}</span></td>
						    </tr>`);
  		// TOTAL COMPRA
		// OBTENER LA SUMA DE precioFinal ENTRE TODOS LOS OBJETOS DEL ARRAY
		total = SELECCIONADOS.reduce(function (previos, actual) {
			return previos + actual.precioFinal;
		}, 0);

		// previos (requerido): This is the accumulated value previously returned from the function or the initial value if it was supplied.
		// actual (requerido): This is the value of the current element in the array.
		// 0 (opcional): This is the initial value to be passed to the function. If no initial value is supplied, the first element in the array will be used as the initial accumulator value and the second element becomes the current value.
	}

	// CUOTAS
	let totalTresCuotas = total / 3;
	let interés = total * 0.35;
	let precioTotalConInteres = total + interés; 
	let totalSeisCuotas = precioTotalConInteres / 6;

	// FORMULARIO FINALIZAR COMPRA: (ARREGLAR EL TOTAL!)
	$('#finalizar-compra-formulario').html(`<div class="content__paragraph4">
						<h1 class="heading">FINALIZAR COMPRA</h1>
						<div class="contacto-box">
						<div class="contacto-box__productos-contacto">
						<hr>
						<p id="total-compra"><strong>Total compra: $ ${total}</strong></p>
						</div>
						<div class="form-style">
						<form action="" name="formulario-finalizar-compra" id="formulario-finalizar-compra" onsubmit="respuestaFinalizarCompra(event)"> 
						<input type="text" id="nombre" placeholder="Nombre"><br> 
						<input type="email" id="email" placeholder="Email"><br>
						<input type="tel" id="teléfono" placeholder="Teléfono"><br> 
						<label for="ubicacion">Cantidad de cuotas</label><br>
						<select id="cuotas-elegidas" name="ubicacion">
						<option value="1">1  Pagos de $ ${total}</option>
						<option value="2">3  Pagos de $ ${totalTresCuotas}</option>
						<option value="3">6  Pagos de $ ${totalSeisCuotas}</option>	
						</select><br>
						<label for="tarjeta">Medio de pago</label><br>
						<input type="tel" id="tarjeta" placeholder="Número de tarjeta"><br>
						<input type="text" id="titular" placeholder="Titular de tarjeta"><br> 
						<input type="tel" id="vencimiento" placeholder="Vencimiento (MM/AA)"><br>
						<input type="tel" id="cvv" placeholder="CVV"><br>
						<input type="submit" value="FINALIZAR COMPRA">
						</form>
						<p id="mensaje-error-2" style="display: none">Por favor, completá todos los campos para finalizar la compra.</p>
						</div>
						</div>
						</div>`);
}


// ELIMINAR PRODUCTO DE TABLA
function eliminar(idProducto) {
	let buscarProductoEliminado = SELECCIONADOS.find(elemento => elemento.id == idProducto);
	buscarProductoEliminado.quitarProducto();
	console.log(buscarProductoEliminado);
	
	// BORRAR DE LA TABLA
	for (let i = 0; i < SELECCIONADOS.length; i++) {
		if (SELECCIONADOS[i] == buscarProductoEliminado) {
			SELECCIONADOS.splice(i, 1);
		}
	}
	
	console.log(SELECCIONADOS);
	generarCarritoProductos();
}


// BOTÓN FINALIZAR COMPRA
function respuestaFinalizarCompra(event) {
	event.preventDefault();
	let nombre = document.getElementById('nombre').value; 
	localStorage.setItem('nombre', nombre);
	nombre = localStorage.getItem('nombre');

	let email = document.getElementById('email').value;
	localStorage.setItem('email', email);
	email = localStorage.getItem('email');

	let teléfono = document.getElementById('teléfono').value;
	localStorage.setItem('teléfono', teléfono);
	teléfono = localStorage.getItem('teléfono');

	let tarjeta = document.getElementById('tarjeta').value;
	let titular = document.getElementById('titular').value;
	let vencimiento = document.getElementById('vencimiento').value;
	let cvv = document.getElementById('cvv').value;
	let datosComprador = [nombre, email, teléfono, tarjeta, titular, vencimiento, cvv];
	console.log(datosComprador);

	if ((nombre == '') || (email == '') || (teléfono == '') || (tarjeta == '') || (titular == '') || (vencimiento == '') || (cvv == '')) {
		$('#mensaje-error-2').show();
	} else {
		$('#mensaje-error-2').hide();

		$('#mensaje-final').html(`<div id="mensaje-final-content">
					  <span id="close" onclick="cerrarMensajeFinal()">&times;</span>
					  <div>CONFIRMACIÓN DE PEDIDO</div>
					  <div>¡Gracias por elegirnos, ${nombre}! Estaremos enviando tu pedido en las próximas 24 horas.<br>
					  Por favor, revisá el correo que te enviamos a ${email}</div>
					  </div>`);

		$('#mensaje-final').fadeOut(0.5, function() {
			$('#mensaje-final').fadeIn(2000);
		});

		$('#tarjeta').val('');
		$('#titular').val('');
		$('#vencimiento').val('');
		$('#cvv').val('');

		for (let i = 0; i < SELECCIONADOS.length; i++) {
			SELECCIONADOS[i].vender();
		}
		console.log(SELECCIONADOS);
	}
}


// CERRAR EL MODAL
function cerrarMensajeFinal() {
	modal.style.display = "none";
	SELECCIONADOS = [];
	console.log(SELECCIONADOS);
	$('#productos-listados').val('1');
	$('#resumen-productos').html(``);
	$('#table-body-carrito').html(``);
	$('#finalizar-compra-formulario').html(``);
}

