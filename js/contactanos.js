const modalMsg = new bootstrap.Modal(document.getElementById("modalMsg"))
const btn = document.getElementById("boxButton");

document.getElementById("form")
 .addEventListener('submit', function(event) {
   event.preventDefault();

   btn.value = 'Enviando...';
   

   const serviceID = 'default_service';
   const templateID = 'template_wi3tktr';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = '¡Enviado!';
      modalMsg.show()
    }, (err) => {
      btn.value = '¡Enviado';
      alert(JSON.stringify(err));
      modalMsg
    });
});