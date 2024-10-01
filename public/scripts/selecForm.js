/*
const selectform = document.querySelector("#selectForm")
const formPlayers = document.querySelector('.players')
const formulario = document.querySelector('.form')
const formStaff = document.querySelector('.staff')
const formSelect = document.querySelector('.tipoForm')
const butBack = document.querySelector('.back')

const seleccionarFormulario = (id) => {
    if(id==0){
        formulario.style.display = 'none';
        formSelect.style.margin = '0px auto 500px auto';
    }
    if(id==1){
        formulario.style.display = 'flex';
        formPlayers.style.display = 'flex';
        formStaff.style.display = 'none';
        formulario.style.margin = '20px auto';
        formSelect.style.margin = '0px auto';
        formSelect.style.display = 'none';
        butBack.style.display = 'flex';
    }
    if(id==2){
        formulario.style.display = 'flex';
        formStaff.style.display = 'flex';
        formPlayers.style.display = 'none';
        formulario.style.margin = '20px auto';
        formSelect.style.margin = '0px auto';
        formSelect.style.display = 'none';
        butBack.style.display = 'flex';
    }
};

selectForm.addEventListener('change', () => {
    const id = selectForm.value;
    console.log(id);
    seleccionarFormulario(id);
});

const volverAtras = () => {
    formSelect.style.display = 'flex';
    formulario.style.display = 'none';
    selectForm.value = 0;
    formSelect.style.margin = '0px auto 500px auto';
    butBack.style.display = 'none';
} 
*/

let PlayerForm = document.getElementById("PlayerForm");
let StaffForm = document.getElementById("StaffForm");
let btn = document.getElementById("btn");
    
toggleForm = (formType) => {
    if (formType === 'Staff') {
        PlayerForm.classList.remove('active');
        StaffForm.classList.add('active');
        btn.style.left = "110px";
        butStaff.style.color = "#000";
        butPlayer.style.color = "#edededcd";
    } else {
        StaffForm.classList.remove('active');
        PlayerForm.classList.add('active');
        btn.style.left = "0";
        butStaff.style.color = "#edededcd";
        butPlayer.style.color = "#000";
    }
}
    
