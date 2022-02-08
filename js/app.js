//Variables y selectores
const fomrulario = document.querySelector('#agregar-gasto');
const gastosListado = document.querySelector('#gastos ul');
//Eventos
eventListeners();
function eventListeners() {
  document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
  fomrulario.addEventListener('submit', agregarGasto);
}
//Clases
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }
  //Agregar el gasto nuevo al arreglo gastos
  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }
  //calcular restante
  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
  }
}
class UI {
  insertarPresupuesto(cantidad) {
    //Extraer valores de Obj cantidad
    const {presupuesto, restante} = cantidad;
    //Agregar al HTML
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;
  }
  imprimirAlerta(mensaje, tipo) {
    const divAlerta = document.createElement('div');
    divAlerta.classList.add('text-center', 'alert');
    if (tipo === 'error') {
      divAlerta.classList.add('alert-danger');
    } else {
      divAlerta.classList.add('alert-success');
    }
    //mensajes
    divAlerta.textContent = mensaje;
    document.querySelector('.primario').insertBefore(divAlerta, fomrulario);
    setTimeout(() => {
      divAlerta.remove();
    }, 3000);
  }
  agregarGastoListado(gastos) {
    this.limpiarHTML(); //eliminar el HTML previo
    gastos.forEach(gasto => {
      const {cantidad, nombre, id} = gasto;
      //Crear Li para listar los gastos
      const nuevoGasto = document.createElement('li');
      nuevoGasto.className =
        'list-group-item d-flex justify-content-between align-items-center';
      nuevoGasto.dataset.id = id;
      //agregar al HTML
      nuevoGasto.innerHTML = `
        ${nombre} <span class="badge badge-primary badge-pill">$${cantidad}</span>
      `;
      //boton para agregar el gasto
      const btnBorrar = document.createElement('button');
      btnBorrar.innerHTML = '&times';
      btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
      nuevoGasto.appendChild(btnBorrar);
      //Agregar al HTML
      gastosListado.appendChild(nuevoGasto);
    });
  }
  limpiarHTML() {
    while (gastosListado.firstChild) {
      gastosListado.removeChild(gastosListado.firstChild);
    }
  }
  actualizarRestante(restante) {
    document.querySelector('#restante').textContent = restante;
  }
  comprobarPresupuesto(presupuestoObj) {
    const {presupuesto, restante} = presupuestoObj;
    const restanteDiv = document.querySelector('.restante');
    //comprobar 25%
    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove('alert-success', 'alert-warning');
      restanteDiv.classList.add('alert-danger');
    } else if (presupuesto / 2 > restante) {
      restanteDiv.classList.remove('alert-success', 'alert-danger');
      restanteDiv.classList.add('alert-warning');
    }

    if (restante <= 0) {
      ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
      fomrulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}
// Instancias
const ui = new UI();
let presupuesto;

//Funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');
  if (
    presupuestoUsuario == '' ||
    presupuestoUsuario == null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
  }
  presupuesto = new Presupuesto(presupuestoUsuario);
  ui.insertarPresupuesto(presupuesto);
}
function agregarGasto(e) {
  e.preventDefault();
  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);
  //validar si los campos estan llenos
  if (!nombre || !cantidad) {
    ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    //Validar el campo cantidad
    ui.imprimirAlerta('Cantidad no valida', 'error');
    return;
  }
  //Generar un objeto con el gasto
  const gasto = {nombre, cantidad, id: Date.now()};
  presupuesto.nuevoGasto(gasto);
  //mensaje de agregado
  ui.imprimirAlerta('Correcto');
  //Imprimir los gastos
  const {gastos, restante} = presupuesto;
  ui.agregarGastoListado(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
  //Reinicia el formulario
  fomrulario.reset();
}
