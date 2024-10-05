const PostulacionesHTML = document.querySelector(".PostulacionesHTML")

const cargarPostulaciones = (Post) => {
    let content = '';
    Post.forEach(postplayers => {
        content += `<div class="Post">
            <img src="../img/Logo Warriors.jpeg" alt="Logo">
            <h2>Puesto Necesitado</h2>
            <div class="Requisitos">
                <h3>Requisitos</h3>
                <p>Rango: ${postplayers.rango}</p>
                <p>Edad minima: ${postplayers.edadMinima}</p>
                <p>Experiencia Previa: ${postplayers.experiencia == 1 ? 'Requerida' : 'No Requerida'}</p>
                <p>Roles: ${postplayers.roles}</p>
                <p>Disponibilidad Horaria</p>
                <p>${postplayers.horario}</p>
            </div>
            <a href="/Formulario"><input type="button" class="btn-post" value="Postulate"></a>
        </div>`;
    });
    PostulacionesHTML.innerHTML = content;
}

cargarPostulaciones(listaPostulaciones);