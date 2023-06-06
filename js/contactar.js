// URL de la API
const url = "http://localhost:8080/api/contactos"

// Elementos del DOM
const cuerpoTabla = document.getElementById("tablaContactar")
let resultadosCont = ""


// Modales
const modalCrearCont = new bootstrap.Modal(document.getElementById("modalCrearCont"))
const cuerpoCrearCont = document.getElementById("cuerpoCrearCont")
let opcionCont = ""

const modalActCont = new bootstrap.Modal(document.getElementById("modalActCont"))
const cuerpoActCont = document.getElementById("cuerpoActCont")

const confirmModal = new bootstrap.Modal(document.getElementById('modalDelCont'))
const btnConfirmDelete = document.getElementById('ConfirmDel')

// MOSTRAR: Obtener todos los contactos
const urlListadoContactar = `${url}/todos`
fetch(urlListadoContactar)
    .then(response => response.json())
    .then(data => mostrarContactar(data))
    .catch(error => console.log(error))

// Función para mostrar los contactos en la tabla
const mostrarContactar = (arregloContactar) => {
    arregloContactar.forEach(contactar => {
        resultadosCont += `<tr>
                            <td class="text-center">ID: ${contactar.idResidente.idResidente} - ${contactar.idResidente.nombreResidente} ${contactar.idResidente.apellidoResidente}</td>
                            <td class="text-center">${contactar.correoResidente}</td>
                            <td class="text-center">${contactar.telefonoResidente}</td>
                            <td class="text-center">${contactar.idContacto}</td>
                            <td class="text-center">
                                <button id="btnActCont" class="btn btn-sm btn-info text-white">Actualizar</button>
                                <button id="btnDelCont" class="btn btn-sm btn-danger text-white">Eliminar</button>
                            </td>
                        </tr>`
    })
    cuerpoTabla.innerHTML = resultadosCont
}

// Función para agregar un escuchador de eventos
const onContactar = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

// CREAR: Elementos del formulario de creación
const selectIdRes = document.getElementById("idRes")
const inputEmailCont = document.getElementById("emailCont")
const inputTelCont = document.getElementById("telCont")

// Cargar opciones del combo de residentes en el modal de creación
const comboContactar = () => {
    const urlListadoContactar = "http://localhost:8080/api/residentes/todos"
    fetch(urlListadoContactar)
        .then(response => response.json())
        .then(data => cargarIdCombo(data))
        .catch(error => console.log(error))
}
const cargarIdCombo = (arregloId) => {
    const cargarIdCuerpo = document.getElementById("idRes")
    let resultadosId = ""
    arregloId.forEach(idElement => {
        resultadosId += `<option value="${idElement.idResidente}">ID: ${idElement.idResidente} - ${idElement.nombreResidente} ${idElement.apellidoResidente}</option>`
    })

    cargarIdCuerpo.innerHTML = resultadosId
}

// Abrir el modal de creación de contactos
btnCreCont.addEventListener("click", () => {
    selectIdRes.value = ""
    inputEmailCont.value = ""
    inputTelCont.value = ""
    modalCrearCont.show()
    comboContactar()
    opcionCont = "crearCont"
})

// Crear contacto
cuerpoCrearCont.addEventListener("submit", (e) => {
    e.preventDefault()

    if (opcionCont === "crearCont") {
        const urlCrear = `${url}/crear`

        fetch(urlCrear, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idResidente: selectIdRes.value,
                correoResidente: inputEmailCont.value,
                telefonoResidente: inputTelCont.value
            })
        })
            .then(response => response.json())
            .then(response => location.reload())
            .then(data => {
                const nuevoCont = []
                nuevoCont.push(data)
                mostrarContactar(nuevoCont)
            })
    }
    modalCrearCont.hide()
})

//ACTUALIZAR: Elementos del formulario de actualización
const selectIdResAct = document.getElementById("idResAct")
const inputEmailContAct = document.getElementById("emailContAct")
const inputTelContAct = document.getElementById("telContAct")

// Escuchador de eventos para el botón de actualizar
let idActContacto
onContactar(document, "click", "#btnActCont", e => {
    const fila = e.target.parentNode.parentNode
    idActContacto = fila.children[3].innerHTML

    const urlUno = `${url}/obtener/${idActContacto}`

    fetch(urlUno)
        .then(response => response.json())
        .then(data => mostrarCont(data))
        .catch(error => console.log(error))
})

// Mostrar datos del contacto en el modal de actualización
const mostrarCont = (data) => {
    selectIdResAct.value = data.idResidente.idResidente
    inputEmailContAct.value = data.correoResidente
    inputTelContAct.value = data.telefonoResidente
    opcionRec = "editarCont"
    modalActCont.show()
    comboContAct()
}

// Cargar opciones del combo de residentes en el modal de actualización
const comboContAct = () => {
    const urlListadoContactarAct = "http://localhost:8080/api/residentes/todos"
    fetch(urlListadoContactarAct)
        .then(response => response.json())
        .then(data => cargarIdComboAct(data))
        .catch(error => console.log(error))
}
const cargarIdComboAct = (arregloId) => {
    const cargarIdCuerpoAct = document.getElementById("idResAct")
    let resultadosIdAct = ""
    arregloId.forEach(idElementAct => {
        resultadosIdAct += `<option value="${idElementAct.idResidente}">ID: ${idElementAct.idResidente} - ${idElementAct.nombreResidente} ${idElementAct.apellidoResidente}</option>`
    })
    cargarIdCuerpoAct.innerHTML = resultadosIdAct
}

// Crear actualizacion de contacto
cuerpoActCont.addEventListener("submit", (e) => {
    e.preventDefault()

    if (opcionRec === "editarCont") {
        const urlActCont = `${url}/actualizar`

        fetch(urlActCont, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idContacto: idActContacto,
                correoResidente: inputEmailContAct.value,
                telefonoResidente: inputTelContAct.value,
                idResidente: selectIdResAct.value
            })
        })
            .then(response => response.json())
            .then(response => location.reload())
    }
    modalActCont.hide()
})

//ELIMINAR: Escuchador de eventos se obtiene ID Contacto
onContactar(document, "click", "#btnDelCont", e => {
    const fila = e.target.parentNode.parentNode
    const idContacto = fila.children[3].innerHTML
    confirmModal.show()

    btnConfirmDelete.addEventListener('click', () => {
        eliminarContactar(idContacto)
        confirmModal.hide()
    })
})

// Función para eliminar contacto
const eliminarContactar = (idContacto) => {
    const urlBorrar = `${url}/borrar/${idContacto}`
    fetch(urlBorrar, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(() => location.reload())
        .catch(error => console.log(error))
}