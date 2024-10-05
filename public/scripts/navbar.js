function showSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'flex'
}
function hideSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'none'
}

const sesionIniciada = localStorage.getItem("sesionIniciada");
const boton = document.getElementById("boton");

if(sesionIniciada == 'true'){
    boton.innerText = "Admin";
    boton.href = '/admin';
}
else {
    boton.innerText = "Iniciar Sesion";
    boton.href = '/login';
}