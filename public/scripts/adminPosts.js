let ValidarPlayerPost = document.getElementById("ValidarPlayerPost");
let ValidarStaffPost = document.getElementById("ValidarStaffPost");
let btnValidar = document.getElementById("btn-validar");
let butPlayerValidar = document.getElementById("butPlayerValidar");
let butStaffValidar = document.getElementById("butStaffValidar");
    
const toggleFormValidar = (FormType) => {
    if (FormType == 'Staff') {
        ValidarStaffPost.classList.add('active');
        ValidarPlayerPost.classList.remove('active');
        btnValidar.style.left = "110px";
        butStaffValidar.style.color = "#000";
        butPlayerValidar.style.color = "#edededcd";
    } else {
        ValidarPlayerPost.classList.add('active');
        ValidarStaffPost.classList.remove('active');
        btnValidar.style.left = "0";
        butStaffValidar.style.color = "#edededcd";
        butPlayerValidar.style.color = "#000";
    }
}


let ModificarPlayerPost = document.getElementById("ModificarPlayerPost");
let ModificarStaffPost = document.getElementById("ModificarStaffPost");
let btnModificar = document.getElementById("btn-Modificar");
let butPlayerModificar = document.getElementById("butPlayerModificar");
let butStaffModificar = document.getElementById("butStaffModificar");
    
const toggleFormModificar = (FormType) => {
    if (FormType == 'Staff') {
        ModificarStaffPost.classList.add('active');
        ModificarPlayerPost.classList.remove('active');
        btnModificar.style.left = "110px";
        butStaffModificar.style.color = "#000";
        butPlayerModificar.style.color = "#edededcd";
    } else {
        ModificarPlayerPost.classList.add('active');
        ModificarStaffPost.classList.remove('active');
        btnModificar.style.left = "0";
        butStaffModificar.style.color = "#edededcd";
        butPlayerModificar.style.color = "#000";
    }
}


let EliminarPlayerPost = document.getElementById("EliminarPlayerPost");
let EliminarStaffPost = document.getElementById("EliminarStaffPost");
let btnEliminar = document.getElementById("btn-Eliminar");
let butPlayerEliminar = document.getElementById("butPlayerEliminar");
let butStaffEliminar = document.getElementById("butStaffEliminar");
    
const toggleFormEliminar = (FormType) => {
    if (FormType == 'Staff') {
        EliminarStaffPost.classList.add('active');
        EliminarPlayerPost.classList.remove('active');
        btnEliminar.style.left = "110px";
        butStaffEliminar.style.color = "#000";
        butPlayerEliminar.style.color = "#edededcd";
    } else {
        EliminarPlayerPost.classList.add('active');
        EliminarStaffPost.classList.remove('active');
        btnEliminar.style.left = "0";
        butStaffEliminar.style.color = "#edededcd";
        butPlayerEliminar.style.color = "#000";
    }
}