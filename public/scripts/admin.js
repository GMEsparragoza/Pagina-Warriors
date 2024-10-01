const sesionIniciada = localStorage.getItem("sesionIniciada");
const menuCerrar = document.querySelector(".menuCerrar");
const menuxLog = document.querySelector(".menuxLog");
const botonLogout = document.querySelector("#boton-logout");


if(sesionIniciada == 'true'){
    menuCerrar.style.display = 'block';
    menuxLog.style.display = 'none';
}
else {
    menuCerrar.style.display = 'none';
    menuxLog.style.display = 'block';
}

botonLogout.addEventListener("click", () => {
    localStorage.clear();
})