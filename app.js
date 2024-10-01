// importar la libreria
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const session = require('express-session');
const bcryptjs = require('bcryptjs');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Warriors'
});

connection.connect((err) => {
    if(err){
        console.error('Error en la BD', err);
        return;
    }
    console.log("Conexion exitosa a la BD");
})

module.exports = connection;

// Objetos para llamar a los metodos de express
const app = express();

//configuraciones
app.use(cors());

app.use(express.json());

app.set("view engine", "ejs");
    
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret: 'secret',
    resave: 'true',
    saveUninitialized: true
}));

//Middleware o Ruta de archivos estáticos
app.use(express.static("public"));

app.get("/", (req,res) => {

    const PostPlayers = "SELECT * FROM PostPlayers"
    Post = [];
    connection.query(PostPlayers, (err, Post) => {
        if(err){
            res.status(500).send('Error database');
            return;
        }else{
            res.render("index", { Post });
        }
    });
});

app.get("/Equipos", (req, res) => {
    res.render('Equipos');
});

app.get("/login", (req, res) => {
    if (req.session.loggedin){
        res.redirect("/admin")
    }else{
        res.render('login');
    }
});

app.get("/Contenido", (req, res) => {
    res.render('Contenido');
});

app.get("/Formulario", (req, res) => {
    res.render('Formulario');
});


app.post("/auth", (req,res) => {
    const datosLogin = req.body;

    let user = datosLogin.user;
    let password = datosLogin.password;
    if(user && password){
        let registrar = `SELECT * FROM Admins WHERE (username like '${user}') AND (contra like '${password}')`;
        connection.query(registrar, (err, rows) => {
            if(err){
                console.log(err);
            }
            else{
                console.log(rows)
                if(!rows || rows.length == 0){
                    res.render('login', {
                        alert:true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectos",
                        alertIcon: "error",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: 'login'
                    });
                } 
                else{
                    let UsuarioEncontrado = rows[0];
                    req.session.loggedin = true;
                    req.session.username = UsuarioEncontrado.username;
                    req.session.idAdmin = UsuarioEncontrado.idAdmin;
                    req.session.password = UsuarioEncontrado.contra;
                    req.session.email = UsuarioEncontrado.email;
                    res.render('login', {
                        alert:true,
                        alertTitle: "Conexion Exitosa",
                        alertMessage: "Login Correcto!",
                        alertIcon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: 'admin'
                    });
                }
            }
        })
    }else{
        res.render('login', {
            alert:true,
            alertTitle: "Advertencia",
            alertMessage: "Por Favor Ingrese un usuario y la contraseña",
            alertIcon: "Warning",
            showConfirmButton: false,
            timer: false,
            ruta: 'login'
        });
    }
})

app.get("/admin", (req,res) => {
    
    let sesionIniciada = req.session.loggedin || false;
    let User = req.session.username;
    let idAdmin = req.session.idAdmin;
    let password = req.session.password
    res.render("admin", {
        sesionIniciada: sesionIniciada,
        User: User,
        idAdmin: idAdmin,
        password: password
    });
})

app.get("/logout", (req,res) => {
    req.session.destroy(() => {
        res.redirect("/admin")
    })
})

app.post("/submitPlayers", (req, res) => {
    const datosPlayer = req.body;

    let nombre = datosPlayer.nombre;
    let apellido = datosPlayer.apellido;
    let edad = datosPlayer.edad;
    let nick = datosPlayer.nick;
    let twitter = datosPlayer.twitter;
    let rangoActual = datosPlayer.rangoActual;
    let rangoPeak = datosPlayer.rangoPeak;
    let roles = datosPlayer.roles;
    let experiencia = datosPlayer.experiencia;

    // Usamos una consulta con parámetros
    let registrar = `
    INSERT INTO FormPlayers 
    (nombre, apellido, edad, nick, twitter, rangoActual, rangoPeak, roles, experiencia) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Usamos un array con los valores para prevenir SQL injection
    let valores = [nombre, apellido, edad, nick, twitter, rangoActual, rangoPeak, roles, experiencia];

    connection.query(registrar, valores, (err) => {
        if (err) {
            res.render('Formulario', {
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Verifique que los campos sean correctos",
                alertIcon: "Warning",
                showConfirmButton: true,
                timer: false,
                ruta: 'Formulario'
            });
            return;
        } else {
            res.render('Formulario', {
                alert:true,
                alertTitle: "Conexion Exitosa",
                alertMessage: "Formulario enviado correctamente",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            });
        }
    }); 
});

app.post("/submitStaff", (req, res) => {
    const datosStaff = req.body;

    let nombre = datosStaff.nombre;
    let apellido = datosStaff.apellido;
    let edad = datosStaff.edad;
    let nick = datosStaff.nick;
    let twitter = datosStaff.twitter;
    let rol = datosStaff.rol;
    let experiencia = datosStaff.experiencia;

    // Usamos una consulta con parámetros
    let registrar = `
    INSERT INTO FormStaff 
    (nombre, apellido, edad, nick, twitter, rol, experiencia) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

    // Usamos un array con los valores para prevenir SQL injection
    let valores = [nombre, apellido, edad, nick, twitter, rol, experiencia];

    connection.query(registrar, valores, (err) => {
        if (err) {
            res.render('Formulario', {
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Verifique que los campos sean correctos",
                alertIcon: "Warning",
                showConfirmButton: true,
                timer: false,
                ruta: 'Formulario'
            });
            return;
        } else {
            res.render('Formulario', {
                alert:true,
                alertTitle: "Conexion Exitosa",
                alertMessage: "Formulario enviado correctamente",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            });
        }
    }); 
});

// Configurar puerto para servidor local
app.listen(3000,function(){
    console.log("El Servidor fue creado en http://localhost:3000");
});
