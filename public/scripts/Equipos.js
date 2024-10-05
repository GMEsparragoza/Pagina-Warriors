const RostersContainer = document.querySelector(".RostersContainer");

const cargarEquipos = (Usuarios, Equipos) => {
    Equipos.forEach(Equipo => {
        let nuevoRoster = document.createElement("div");
        nuevoRoster.classList.add("Equipo");
        nuevoRoster.innerHTML += `<div class="EquipoOverlay">
                                    <h3>${Equipo.nombreRoster}</h3>
                                    <p>${Equipo.descripcion}</p>
                                </div>`
        let UsuariosRoster = Usuarios.filter((Usuario) => Usuario.idRoster == Equipo.idRoster);

        let UsuariosContent = "";

        UsuariosRoster.forEach(UsuarioRoster => {
            UsuariosContent += 
            `<a href="/Perfil/${UsuarioRoster.idUser}" class="User">
                    <img src="../img/Logo Warriors.jpeg" alt="Logo">
                    <h2>${UsuarioRoster.nick}</h2>
                    <h4>${UsuarioRoster.rol}</h4>
                </a>`;
        });
        nuevoRoster.innerHTML += `<div class="EquipoContent">` + UsuariosContent + `</div>`;
        RostersContainer.appendChild(nuevoRoster);
    });

}

cargarEquipos(listaUsuarios, listaEquipos);