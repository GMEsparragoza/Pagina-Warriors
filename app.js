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

const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

app.get("/", async (req,res) => {
    let consulta = 'SELECT * FROM PostPlayers';
    try{
        let Post = await query(consulta);
        res.render("index", {Post});
    }
    catch(err){
        res.status(500).send("Error al cargar las Postulaciones");
    }
});

app.get("/Equipos", async (req, res) => {
    let conRosters = 'SELECT * FROM Roster';
    let conUsers = 'SELECT * FROM Usuario';

    try{
        let Rosters = await query(conRosters);
        let Gente = await query(conUsers);
        res.render("Equipos", {Rosters, Gente});
    }
    catch(err){
        res.status(500).send("Error al cargar los Rosters");
    }
});

app.get("/Perfil/:idUser", async (req,res) => {
    let idUser = req.params.idUser;
    let conUsers = `SELECT * FROM Usuario WHERE idUser = ?`;

    try{
        let Gente = await query(conUsers, [idUser]);
        res.render("Perfil", {idUser, Gente: Gente[0]})
    }
    catch(err){
        res.status(500).send("Error al cargar los Rosters");
    }
    
});

app.get("/login", (req, res) => {
    if (req.session.loggedin){
            res.redirect("/admin");
    }else{
        res.render('login');
    }
});

app.get("/Postulaciones", async (req, res) => {
    let consulta = 'SELECT * FROM PostPlayers';
    try{
        let Post = await query(consulta);
        res.render("Postulaciones", {Post});
    }
    catch(err){
        res.status(500).send("Error al cargar las Postulaciones");
    }
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
                    req.session.email = UsuarioEncontrado.email;
                    res.render('login', {
                        alert:true,
                        alertTitle: "Conexion Exitosa",
                        alertMessage: "Login Correcto!",
                        alertIcon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: 'admin',
                        sesionIniciada: true,
                        User: req.session.username,
                        idAdmin: req.session.idAdmin,
                        email: req.session.email
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
    res.render("admin", {
        sesionIniciada: req.session.loggedin || false,
        User: req.session.username,
        idAdmin: req.session.idAdmin,
        email: req.session.email
    });
});

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

app.get("/logout", (req,res) => {
    req.session.destroy(() => {
        res.redirect("/admin");
    })
});

// Configurar puerto para servidor local
app.listen(4000,() => {
    console.log("El Servidor fue creado en http://localhost:4000");
});
