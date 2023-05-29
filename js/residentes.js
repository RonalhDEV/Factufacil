// Conectar base de datos
const url = "http://localhost:8080/api/residentes"
const cuerpoTabla = document.getElementById("tablaResidente");
let resultadosRes = ""

const modalCrearRes = new bootstrap.Modal(document.getElementById("modalCrearRes"))
const cuerpoCrearRes = document.getElementById("cuerpoCrearRes")
let opcionRes = ""

// Obtener todos los residentes
const urlListadoResidentes = `${url}/todos`
fetch(urlListadoResidentes)
    .then(response => response.json())
    .then(data => mostrarResidentes(data))
    .catch(error => console.log(error))

// Mostrar todos los residentes
const mostrarResidentes = (arregloResidetes) => {
    arregloResidetes.forEach(residente => {
        resultadosRes += `<tr>
                            <td class="text-center">${residente.idResidente}</td>
                            <td class="text-center">${residente.nombreResidente}</td>
                            <td class="text-center">${residente.apellidoResidente}</td>
                            <td class="text-center">${residente.documentoResidente}</td>
                            <td class="text-center">${residente.aptoResidente}</td>
                            <td class="text-center">${residente.torreResidente}</td>
                            <td class="text-center">
                                <a href="contactar.html"><button id="btnContRes"
                                    class="btn btn-sm btn btn-warning text-white">Contactar</button></a>
                                <button id="btnActRes" class="btn btn-sm btn-info text-white">Actualizar</button>
                                <button id="btnDelRes" class="btn btn-sm btn-danger text-white">Eliminar</button>
                            </td>
                        </tr>`;
    });
    cuerpoTabla.innerHTML = resultadosRes;
};

//Escuchador de eventos
const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

// Recibir datos de la interfaz
const inputNombreRes = document.getElementById("nombreRes")
const inputApellidoRes = document.getElementById("apellidoRes")
const inputDocumentoRes = document.getElementById("documentoRes")
const inputAptoRes = document.getElementById("aptoRes")
const inputTorreRes = document.getElementById("torreRes")

// Muestra modal crear residente
btnCreRes.addEventListener("click", () => {
    inputNombreRes.value = ""
    inputApellidoRes.value = ""
    inputDocumentoRes.value = ""
    inputAptoRes.value = ""
    inputTorreRes.value = ""
    modalCrearRes.show()
    opcionRes = "crearRes"

    const tituloModalCrear = document.getElementById("tittleModalCrear");
    tituloModalCrear.textContent = "¡Crea un nuevo residente!";
})

// Prepara proceso editar
let idActRes
on(document, "click", "#btnActRes", e => {
    const fila = e.target.parentNode.parentNode
    idActRes = fila.firstElementChild.innerHTML

    const urlUno = `${url}/obtener/${idActRes}`

    fetch(urlUno)
        .then(response => response.json())
        .then(data => mostrarRes(data))
        .catch(error => console.log(error))
})

const mostrarRes = (data) => {
    inputNombreRes.value = data.nombreResidente
    inputApellidoRes.value = data.apellidoResidente
    inputDocumentoRes.value = data.documentoResidente
    inputAptoRes.value = data.aptoResidente
    inputTorreRes.value = data.torreResidente

    opcionRes = "editarRes"
    modalCrearRes.show()

    const tituloModalCrear = document.getElementById("tittleModalCrear");
    if (opcionRes === "editarRes") {
        tituloModalCrear.textContent = "¡Actualiza un residente!";
    } else {
        tituloModalCrear.textContent = "¡Crea un nuevo residente!";
    }
}


// Crear residente o editar residente
cuerpoCrearRes.addEventListener("submit", (e) => {
    e.preventDefault()

    if (opcionRes == "crearRes") {
        const urlCrear = `${url}/crear`

        fetch(urlCrear, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombreResidente: inputNombreRes.value,
                apellidoResidente: inputApellidoRes.value,
                documentoResidente: inputDocumentoRes.value,
                aptoResidente: inputAptoRes.value,
                torreResidente: inputTorreRes.value
            })
        })
            .then(response => response.json())
            .then(data => {
                const nuevoRes = []
                nuevoRes.push(data)
                mostrarResidentes(nuevoRes)
            })
    }

    if (opcionRes == "editarRes") {
        const urlEditar = `${url}/actualizar`

        fetch(urlEditar, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idResidente: idActRes,
                nombreResidente: inputNombreRes.value,
                apellidoResidente: inputApellidoRes.value,
                documentoResidente: inputDocumentoRes.value,
                aptoResidente: inputAptoRes.value,
                torreResidente: inputTorreRes.value
            })
        })
            .then(response => response.json())
            .then(response => location.reload())
    }
    modalCrearRes.hide()
})

// Eliminar residentes
on(document, "click", "#btnDelRes", e => {
    const fila = e.target.parentNode.parentNode;
    const idResidente = fila.firstElementChild.innerHTML;
    const confirmModal = new bootstrap.Modal(document.getElementById('modalDelRes'));
    confirmModal.show();
    const btnConfirmDelete = document.getElementById('ConfirmDel');

    btnConfirmDelete.addEventListener('click', () => {
        eliminarResidente(idResidente);
        confirmModal.hide();
    });
});

// Función para eliminar el residente
const eliminarResidente = (idResidente) => {
    const urlBorrar = `${url}/borrar/${idResidente}`;
    fetch(urlBorrar, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(() => location.reload())
        .catch(error => console.log(error));
};


