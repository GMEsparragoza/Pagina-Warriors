const PostulacionesHTML = document.querySelector(".PostulacionesHTML")

const cargarPostulaciones = (Post) => {
    PostulacionesHTML.innerHTML = '';
    Post.forEach(postplayers => { 
        
        PostulacionesHTML.innerHTML+=
        `<div class="Post">
            <img src="../img/Logo Warriors.jpeg" alt="Logo">
            <h2>Puesto Necesitado</h2>
            <div class="Requisitos">
                <h3>Requisitos</h3>
                <p>Rango: ${postplayers.rango}</p>
                <p>Edad minima: ${postplayers.edadMinima}</p>
                <p>Experiencia Previa ${postplayers.experiencia}</p>
                <p>Roles: ${postplayers.roles}</p>
                <p>Disponibilidad Horaria</p>
                <p>${postplayers.horario}</p>
            </div>
            <button><a href="http://localhost:3000/Formulario">Postulate</a></button>
        </div>`
    });
}

cargarPostulaciones(listaPostulaciones);