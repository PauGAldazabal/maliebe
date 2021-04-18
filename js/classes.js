//----------------------------------CLASES----------------------------------//
class Producto {
	constructor(datos) {
		this.id = datos.id;
		this.línea = datos.línea;
		this.nombre = datos.nombre;
		this.precio = datos.precio;
		this.características = datos.características;
		this.img = datos.img;
		this.alt = datos.alt;
		this.carrito = true;
		this.unidad = parseInt($('#cantidad-selección').val());
		this.compra = false;
		this.precioFinal = parseInt($('#cantidad-selección').val()) * datos.precio; 
	}

	agregarUnidad() {
		return this.unidad = this.unidad + parseInt($('#cantidad-selección').val());	
	}

	actualizarPrecioFinal() {
		return this.precioFinal = this.precioFinal + (parseInt($('#cantidad-selección').val()) * this.precio);
	}

	obtenerSubtotal() {
		return (this.unidad * this.precio);
	}

	quitarProducto() {
		return this.carrito = false;
	}

	vender() {
		return this.compra = true;
	}
}



