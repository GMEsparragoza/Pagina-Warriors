const menuCerrar = document.getElementsByClassName("menuCerrar")[0]; // Accediendo al primer elemento
const menuxLog = document.getElementsByClassName("menuxLog")[0];     // Accediendo al primer elemento
const nombre = document.getElementById("nombre");
const usuario = localStorage.getItem("usuario");

if (sesionIniciada == 'true') {
    if (menuCerrar) menuCerrar.style.display = 'block';
    if (menuxLog) menuxLog.style.display = 'none';
    if (nombre) nombre.innerHTML = usuario;
} else {
    if (menuCerrar) menuCerrar.style.display = 'none';
    if (menuxLog) menuxLog.style.display = 'block';
}
const CerrarSesion = () => {
    localStorage.clear();
}


