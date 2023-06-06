// Conectar base de datos contactar
const url = "http://localhost:8080/api/contactos";
const cuerpoTabla = document.getElementById("tablaContactar");
let resultadosCont = ""

const modalCrearCont = new bootstrap.Modal(document.getElementById("modalCrearCont"))
const cuerpoCrearCont = document.getElementById("cuerpoCrearCont")
let opcionCont = ""

// Obtener todos los recibos
const urlListadoContactar = `${url}/todos`;
fetch(urlListadoContactar)
    .then(response => response.json())
    .then(data => mostrarContactar(data))
    .catch(error => console.log(error));

// Mostrar todos los recibos
const mostrarContactar = (arregloContactar) => {
    arregloContactar.forEach(contactar => {
        resultadosCont += `<tr>
                            <td class="text-center">ID: ${contactar.idResidente.idResidente} - ${contactar.idResidente.nombreResidente} ${contactar.idResidente.apellidoResidente}</td>
                            <td class="text-center">${contactar.correoResidente}</td>
                            <td class="text-center">${contactar.telefonoResidente}</td>
                            <td class="text-center">
                                <button id="btnActRec" class="btn btn-sm btn-info text-white">Actualizar</button>
                                <button id="btnDelRec" class="btn btn-sm btn-danger text-white">Eliminar</button>
                            </td>
                        </tr>`;
    });
    cuerpoTabla.innerHTML = resultadosCont;
};

//Escuchador de eventos
const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

// CREAR

// Recibir datos de la interfaz
const selectIdRes = document.getElementById("idRes")
const inputEmailCont = document.getElementById("emailCont")
const inputTelCont = document.getElementById("telCont")

// Carga idResidente en modal crear
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
    });

    cargarIdCuerpo.innerHTML = resultadosId
    console.log(resultadosId);
}

// Muestra modal crear recibo
btnCreCont.addEventListener("click", () => {
    selectIdRes.value = ""
    inputEmailCont.value = ""
    inputTelCont.value = ""
    modalCrearCont.show()
    comboContactar()
    opcionCont = "crearCont"
})

// Crear recibo
cuerpoCrearCont.addEventListener("submit", (e) => {
    e.preventDefault()

    if (opcionCont == "crearCont") {
        const urlCrear = `${url}/crear`

        fetch(urlCrear, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idResidente: selectIdRes.value,
                correoResidente: inputEmailCont.value,
                telefonoResidente: inputTelCont.value,
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