//Variables y selectores
const fomrulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
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
  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    console.log(this.gastos);
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

  if (!nombre || !cantidad) {
    ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta('Cantidad no valida', 'error');
    return;
  }
  //Generar un objeto con el gasto
  const gasto = {nombre, cantidad, id: Date.now()};
  presupuesto.nuevoGasto(gasto);
  //mensaje de agregado
  ui.imprimirAlerta('Correcto');
  //Reinicia el formulario
  fomrulario.reset();
}
