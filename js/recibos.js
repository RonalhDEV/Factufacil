// URL de la API
const url = "http://localhost:8080/api/recibos"

// Elementos del DOM
const cuerpoTabla = document.getElementById("tablaRecibo");
let resultadosRec = ""

// Modales
const modalCrearRec = new bootstrap.Modal(document.getElementById("modalCrearRec"))
const cuerpoCrearRec = document.getElementById("cuerpoCrearRec")
let opcionRec = ""

const modalActRec = new bootstrap.Modal(document.getElementById("modalActRec"))
const cuerpoActRec = document.getElementById("cuerpoActRec")

const confirmModal = new bootstrap.Modal(document.getElementById('modalDelRec'));
const btnConfirmDelete = document.getElementById('ConfirmDel');

// MOSTRAR: Obtener todos los contactos
const urlListadoRecibos = `${url}/todos`
fetch(urlListadoRecibos)
    .then(response => response.json())
    .then(data => mostrarRecibos(data))
    .catch(error => console.log(error))

// Función para mostrar los contactos en la tabla
const mostrarRecibos = (arregloRecibos) => {
    arregloRecibos.forEach(recibo => {
        resultadosRec += `<tr>
                            <td class="text-center">ID: ${recibo.idResidente.idResidente} - ${recibo.idResidente.nombreResidente} ${recibo.idResidente.apellidoResidente}</td>
                            <td class="text-center">${recibo.valorAPagar}</td>
                            <td class="text-center">${recibo.periodoDeCobro}</td>
                            <td class="text-center">${recibo.fechaDePago}</td>
                            <td class="text-center">${recibo.estadoDeRecibo}</td>
                            <td class="text-center">${recibo.idRecibo}</td>
                            <td class="text-center">
                                <a href="contactar.html"><button id="btnContRec"
                                    class="btn btn-sm btn btn-warning text-white">Contactar</button></a>
                                <button id="btnActRec" class="btn btn-sm btn-info text-white">Actualizar</button>
                                <button id="btnDelRec" class="btn btn-sm btn-danger text-white">Eliminar</button>
                            </td>
                        </tr>`;
    });
    cuerpoTabla.innerHTML = resultadosRec;
};

// Función para agregar un escuchador de eventos
const onRecibos = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

// CREAR: Elementos del formulario de creación
const selectIdRes = document.getElementById("idRes")
const inputValorRec = document.getElementById("valorRec")
const inputPeriodoRec = document.getElementById("periodoRec")
const inputFechaRec = document.getElementById("fechaRec")
const inputEstadoRec = document.getElementById("estadoRec")


// Cargar opciones del combo de residentes en el modal de creación
const comboRecibo = () => {
    const urlListadoRecibos = "http://localhost:8080/api/residentes/todos"
    fetch(urlListadoRecibos)
        .then(response => response.json())
        .then(data => cargarIdCombo(data))
        .catch(error => console.log(error))

}
const cargarIdCombo = (arregloId) => {
    const cargarIdCuerpo = document.getElementById("idRes")
    let resultadosId = ""
    arregloId.forEach(idElement => {
        resultadosId += `<option value="${idElement.idResidente}">ID: ${idElement.idResidente} - ${idElement.nombreResidente} ${idElement.apellidoResidente}</option>`
    });
    cargarIdCuerpo.innerHTML = resultadosId
}

// Abrir el modal de creación de recibos
btnCreRec.addEventListener("click", () => {
    selectIdRes.value = ""
    inputValorRec.value = ""
    inputPeriodoRec.value = ""
    inputFechaRec.value = ""
    inputEstadoRec.value = ""
    modalCrearRec.show()
    comboRecibo()
    opcionRec = "crearRec"
})

// Crear recibo
cuerpoCrearRec.addEventListener("submit", (e) => {
    e.preventDefault()

    if (opcionRec == "crearRec") {
        const urlCrear = `${url}/crear`

        fetch(urlCrear, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idResidente: selectIdRes.value,
                fechaDePago: inputFechaRec.value,
                valorAPagar: inputValorRec.value,
                periodoDeCobro: inputPeriodoRec.value,
                estadoDeRecibo: inputEstadoRec.value
            })
        })
            .then(response => response.json())
            .then(response => location.reload())
            .then(data => {
                const nuevoRec = []
                nuevoRec.push(data)
                mostrarRecibos(nuevoRec)
            })

    }
    modalCrearRec.hide()
})

//ACTUALIZAR: Elementos del formulario de actualización
const selectIdResAct = document.getElementById("idResAct")
const inputValorRecAct = document.getElementById("valorRecAct")
const inputPeriodoRecAct = document.getElementById("periodoRecAct")
const inputFechaRecAct = document.getElementById("fechaRecAct")
const inputEstadoRecAct = document.getElementById("estadoRecAct")

// Escuchador de eventos para el botón de actualizar
let idActRecibo
onRecibos(document, "click", "#btnActRec", e => {
    const fila = e.target.parentNode.parentNode
    idActRecibo = fila.children[5].innerHTML;

    const urlUno = `${url}/obtener/${idActRecibo}`

    fetch(urlUno)
        .then(response => response.json())
        .then(data => mostrarRec(data))
        .catch(error => console.log(error))
})

// Mostrar datos del recibos en el modal de actualización
const mostrarRec = (data) => {
    selectIdResAct.value = data.idResidente.idResidente;
    inputValorRecAct.value = data.valorAPagar;
    inputPeriodoRecAct.value = data.periodoDeCobro;
    inputFechaRecAct.value = data.fechaDePago;
    inputEstadoRecAct.value = data.estadoDeRecibo;
    opcionRec = "editarRec";
    modalActRec.show();
    comboReciboAct()
}

// Cargar opciones del combo de residentes en el modal de actualización
const comboReciboAct = () => {
    const urlListadoRecibosAct = "http://localhost:8080/api/residentes/todos"
    fetch(urlListadoRecibosAct)
        .then(response => response.json())
        .then(data => cargarIdComboAct(data))
        .catch(error => console.log(error))
}
const cargarIdComboAct = (arregloId) => {
    const cargarIdCuerpoAct = document.getElementById("idResAct")
    let resultadosIdAct = ""
    arregloId.forEach(idElementAct => {
        resultadosIdAct += `<option value="${idElementAct.idResidente}">ID: ${idElementAct.idResidente} - ${idElementAct.nombreResidente} ${idElementAct.apellidoResidente}</option>`
    });
    cargarIdCuerpoAct.innerHTML = resultadosIdAct
}

// Crear actualizacion de recibo
cuerpoActRec.addEventListener("submit", (e) => {
    e.preventDefault()

    if (opcionRec == "editarRec") {
        const urlActRec = `${url}/actualizar`

        fetch(urlActRec, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idRecibo: idActRecibo,
                idResidente: selectIdResAct.value,
                fechaDePago: inputFechaRecAct.value,
                valorAPagar: inputValorRecAct.value,
                periodoDeCobro: inputPeriodoRecAct.value,
                estadoDeRecibo: inputEstadoRecAct.value
            })
        })
            .then(response => response.json())
            .then(response => location.reload())
    }
    modalActRec.hide()
})

// ELIMINAR

//ELIMINAR: Escuchador de eventos se obtiene ID Recibo
onRecibos(document, "click", "#btnDelRec", e => {
    const fila = e.target.parentNode.parentNode;
    const idRecibo = fila.children[5].innerHTML;
    confirmModal.show();

    btnConfirmDelete.addEventListener('click', () => {
        eliminarResidente(idRecibo);
        confirmModal.hide();
    });
});

// Función para eliminar recibo
const eliminarResidente = (idRecibo) => {
    const urlBorrar = `${url}/borrar/${idRecibo}`;
    fetch(urlBorrar, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(() => location.reload())
        .catch(error => console.log(error));
};