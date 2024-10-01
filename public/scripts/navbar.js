function showSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'flex'
}
function hideSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'none'
}

const boton = document.getElementById("boton");

if(localStorage.getItem("sesionIniciada")){
    boton.innerText = "Admin";
}
else {
    boton.innerText = "Iniciar Sesion";
}