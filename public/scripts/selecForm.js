let PlayerForm = document.querySelector("#PlayerForm");
let StaffForm = document.querySelector("#StaffForm");
let btn = document.getElementById("btn");
    
const toggleForm = (FormType) => {
    if (FormType == 'Staff') {
        StaffForm.classList.add('active');
        PlayerForm.classList.remove('active');
        btn.style.left = "110px";
        StaffForm.style.color = "#000";
        PlayerForm.style.color = "#edededcd";
    } else {
        PlayerForm.classList.add('active');
        StaffForm.classList.remove('active');
        btn.style.left = "0";
        StaffForm.style.color = "#edededcd";
        PlayerForm.style.color = "#000";
    }
}
    
