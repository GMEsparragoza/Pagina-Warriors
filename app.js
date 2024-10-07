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
    saveUninitialized: true,
    loggedin: false
}));

//Middleware o Ruta de archivos estáticos
app.use(express.static("public"));


//Funcion para hacer consulta a la Base de Datos
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

//Conexion para la pagina de Inicio
app.get("/", async (req,res) => {
    let consultaPlayers = 'SELECT * FROM PostPlayers';
    let consultaStaff = 'SELECT * FROM PostStaff';
    try{
        let PostPlayers = await query(consultaPlayers);
        let PostStaff = await query(consultaStaff);
        res.render("index", {
            PostPlayers, 
            PostStaff, 
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email});
    }
    catch(err){
        res.status(500).send("Error al cargar las Postulaciones");
    }
});

//Conexion para la pagina de Equipos
app.get("/Equipos", async (req, res) => {
    let conRosters = 'SELECT * FROM Roster';
    let conUsers = 'SELECT * FROM Usuario';
    try{
        let Rosters = await query(conRosters);
        let Gente = await query(conUsers);
        res.render("Equipos", {Rosters, Gente, 
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email});
    }
    catch(err){
        res.status(500).send("Error al cargar los Rosters");
    }
});

//Conexion con las Paginas de los perfiles de cada Usuario cargado de na BD
app.get("/Perfil/:nick", async (req,res) => {
    let nick = req.params.nick;
    let conUsers = `SELECT * FROM Usuario WHERE nick = ?`;
    try{
        let Gente = await query(conUsers, [nick]);
        res.render("Perfil", {Gente: Gente[0], 
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        })
    }
    catch(err){
        res.status(500).send("Error al cargar los Rosters");
    }
    
});


//Conexion para la pagina de Login
app.get("/login", (req, res) => {
    let sesionIniciada = req.session.loggedin || false;
    if (sesionIniciada){
        res.redirect("/admin");
    }else{
        res.render('login', {
            sesionIniciada,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }
});


//Conexion para la pagina de las Postulaciones
app.get("/Postulaciones", async (req, res) => {
    let consultaPlayers = 'SELECT * FROM PostPlayers';
    let consultaStaff = 'SELECT * FROM PostStaff';
    try{
        let PostPlayers = await query(consultaPlayers);
        let PostStaff = await query(consultaStaff);
        res.render("Postulaciones", {PostPlayers, PostStaff, 
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }
    catch(err){
        res.status(500).send("Error al cargar las Postulaciones");
    }
});


//Conexion para la pagina de enviar Formularios de Postulantes
app.get("/Formulario", (req, res) => {
    res.render('Formulario', {
        sesionIniciada: req.session.loggedin || false,
        User: req.session.username,
        idAdmin: req.session.idAdmin,
        email: req.session.email
    });
});


//Conexion para verificar el Inicio de Sesion
app.post("/auth", async (req,res) => {
    const datosLogin = req.body;

    let email = datosLogin.email;
    let password = datosLogin.password;
    if(email && password){
        let registrar = `SELECT * FROM Admins WHERE (email like ?) AND (contra like ?)`;
        
        try{
            let rows = await query(registrar, [email, password]);
            if(!rows || rows.length == 0){
                res.render('login', {
                    alert:true,
                    alertTitle: "Error",
                    alertMessage: "e-mail y/o Password incorrectos",
                    alertIcon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: 'login',
                    sesionIniciada: req.session.loggedin || false,
                    User: req.session.username,
                    idAdmin: req.session.idAdmin,
                    email: req.session.email
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
        catch(err){
            res.status(500).send("Error al Iniciar Sesion");
        }

    }else{
        res.render('login', {
            alert:true,
            alertTitle: "Advertencia",
            alertMessage: "Por Favor Ingrese un usuario y la contraseña",
            alertIcon: "warning",
            showConfirmButton: false,
            timer: false,
            ruta: 'login',
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }
});


//Conexion para la pagina de Envio de Formulario de Players
app.post("/submitPlayers", async (req, res) => {
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

    try {
        await query(registrar, valores);
        res.render('Formulario', {
            alert:true,
            alertTitle: "Conexion Exitosa",
            alertMessage: "Formulario enviado correctamente",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: '',
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }
    catch(err){
        res.render('Formulario', {
            alert: true,
            alertTitle: "Datos Invalidos",
            alertMessage: "No fue posible enviar el formulario",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: 'Formulario',
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }
});

//Conexion para la pagina de Envio de Formulario de Staff
app.post("/submitStaff", async (req, res) => {
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

    try{
        await query(registrar, valores);
        res.render('Formulario', {
            alert:true,
            alertTitle: "Conexion Exitosa",
            alertMessage: "Formulario enviado correctamente",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: '',
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }
    catch(err){
        res.render('Formulario', {
            alert:true,
            alertTitle: "Advertencia",
            alertMessage: "Verifique que los campos sean correctos",
            alertIcon: "Warning",
            showConfirmButton: true,
            timer: false,
            ruta: 'Formulario',
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    } 
});


//Conexion para la pagina de Administracion
app.get("/admin", (req,res) => {
    if(req.session.loggedin){
        res.render("admin", {
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }
    else {
        res.redirect("/login");
    }
});

//Conexion para Validar el Insert de Postulaciones para Player
app.post("/ValidarPostPlayers", async (req,res) => {
    const datos = req.body;
    let idPost = datos.idPost;
    let rango = datos.rango;
    let edadMinima = datos.edadMinima;
    let experiencia = datos.experiencia;
    let rol = datos.rol;
    let horario = datos.horario;

    let registrar = `INSERT INTO PostPlayers (idPost, rango, edadMinima, experiencia, roles, horario) VALUES (?,?,?,?,?,?)`;
    let valores = [idPost, rango, edadMinima, experiencia, rol, horario];
    
    try{
        await query(registrar, valores);
        res.render('admin', {
            alert:true,
            alertTitle: "Postulacion Valida",
            alertMessage: "Postulacion creada correctamente",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: 'admin',
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }
    catch(err){
        res.render('admin', {
            alert:true,
            alertTitle: "Error al crear la Postulacion",
            alertMessage: "Verifique que los campos sean correctos",
            alertIcon: "warning",
            showConfirmButton: false,
            timer: 1500,
            ruta: 'admin',
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }
});


//Conexion para Validar el Insert de Postulaciones para Staff
app.post("/ValidarPostStaff", async (req,res) => {
    const datos = req.body;
    let idPost = datos.idPost;
    let edadMinima = datos.edadMinima;
    let experiencia = datos.experiencia;
    let rol = datos.rol;
    let horario = datos.horario;

    let registrar = `INSERT INTO PostStaff (idPost, edadMinima, experiencia, roles, horario) VALUES (?,?,?,?,?)`;
    let valores = [idPost, edadMinima, experiencia, rol, horario];
    
    try{
        await query(registrar, valores);
        res.render('admin', {
            alert:true,
            alertTitle: "Postulacion Valida",
            alertMessage: "Postulacion creada correctamente",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: 'admin',
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }
    catch(err){
        res.render('admin', {
            alert:true,
            alertTitle: "Error al crear la Postulacion",
            alertMessage: "Verifique que los campos sean correctos",
            alertIcon: "warning",
            showConfirmButton: false,
            timer: 1500,
            ruta: 'admin',
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }
});


//Conexion para modificar los datos de las Postulaciones para Player
app.post("/ModificarPostPlayers", async (req,res) => {
    const datos = req.body;
    let idPost = datos.idPost;
    let rango = datos.rango;
    let edadMinima = datos.edadMinima;
    let experiencia = datos.experiencia;
    let rol = datos.rol;
    let horario = datos.horario;

    let buscarPost = `SELECT * FROM PostPlayers WHERE idPost = ?`;

    let results = await query(buscarPost, [idPost]);

    if(!results || results.length == 0){
        res.render('admin', {
            alert:true,
            alertTitle: "Error al modificar Postulacion",
            alertMessage: "No se encontro la Postulacion ingresada",
            alertIcon: "warning",
            showConfirmButton: true,
            timer: false,
            ruta: 'admin',
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }

    let actualizarPost = `UPDATE PostPlayers set rango = ?, edadMinima = ?, experiencia = ?, roles = ?,
        horario = ? WHERE idPost = ?`
    let valores = [rango, edadMinima, experiencia, rol, horario, idPost];

    await query(actualizarPost, valores);
    res.render('admin', {
        alert:true,
        alertTitle: "Modificacion satisfactoria",
        alertMessage: "Se actualizaron los datos de la Postulacion",
        alertIcon: "success",
        showConfirmButton: false,
        timer: 1500,
        ruta: 'admin',
        sesionIniciada: req.session.loggedin || false,
        User: req.session.username,
        idAdmin: req.session.idAdmin,
        email: req.session.email
    });
});


//Conexion para modificar los datos de las Postulaciones para Staff
app.post("/ModificarPostStaff", async (req,res) => {
    const datos = req.body;
    let idPost = datos.idPost;
    let edadMinima = datos.edadMinima;
    let experiencia = datos.experiencia;
    let rol = datos.rol;
    let horario = datos.horario;

    let buscarPost = `SELECT * FROM PostStaff WHERE idPost = ?`;

    let results = await query(buscarPost, [idPost]);

    if(!results || results.length == 0){
        res.render('admin', {
            alert:true,
            alertTitle: "Error al modificar Postulacion",
            alertMessage: "No se encontro la Postulacion ingresada",
            alertIcon: "warning",
            showConfirmButton: true,
            timer: false,
            ruta: 'admin',
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }
    else {
        let actualizarPost = `UPDATE PostStaff set edadMinima = ?, experiencia = ?, roles = ?,
        horario = ? WHERE idPost = ?`
    let valores = [edadMinima, experiencia, rol, horario, idPost];

    await query(actualizarPost, valores);
    res.render('admin', {
        alert:true,
        alertTitle: "Modificacion satisfactoria",
        alertMessage: "Se actualizaron los datos de la Postulacion",
        alertIcon: "success",
        showConfirmButton: false,
        timer: 1500,
        ruta: 'admin',
        sesionIniciada: req.session.loggedin || false,
        User: req.session.username,
        idAdmin: req.session.idAdmin,
        email: req.session.email
    });
    }
});


//Conexion para eliminar Postulaciones para Players
app.post("/EliminarPostPlayers", async (req,res) => {
    const idPost = req.body.idPost;

    let buscarPost = `SELECT * FROM PostPlayers WHERE idPost = ?`;

    let results = await query(buscarPost, [idPost]);
    if(!results || results.length == 0){
        res.render('admin', {
            alert:true,
            alertTitle: "Error al eliminar Postulacion",
            alertMessage: "No se encontro la Postulacion ingresada",
            alertIcon: "warning",
            showConfirmButton: true,
            timer: false,
            ruta: 'admin',
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }
    else {
        let registrar = `DELETE FROM PostPlayers WHERE idPost = ?`;
        await query(registrar, [idPost]);
        res.render('admin', {
            alert:true,
            alertTitle: "Postulacion eliminada",
            alertMessage: "Se elimino correctamente la Postulacion ingresada",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: 'admin',
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }
});


//Conexion para eliminar Postulaciones para Staff
app.post("/EliminarPostStaff", async (req,res) => {
    const idPost = req.body.idPost;

    let buscarPost = `SELECT * FROM PostStaff WHERE idPost = ?`;

    let results = await query(buscarPost, [idPost]);
    if(!results || results.length == 0){
        res.render('admin', {
            alert:true,
            alertTitle: "Error al eliminar Postulacion",
            alertMessage: "No se encontro la Postulacion ingresada",
            alertIcon: "warning",
            showConfirmButton: true,
            timer: false,
            ruta: 'admin',
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }
    else {
        let registrar = `DELETE FROM PostStaff WHERE idPost = ?`;
        await query(registrar, [idPost]);
        res.render('admin', {
            alert:true,
            alertTitle: "Postulacion eliminada",
            alertMessage: "Se elimino correctamente la Postulacion ingresada",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: 'admin',
            sesionIniciada: req.session.loggedin || false,
            User: req.session.username,
            idAdmin: req.session.idAdmin,
            email: req.session.email
        });
    }
});

//Sincronizar la Sesion Actual con la del Servidor
app.post("/sincronizarSesion", (req,res) => {
    const idAdmin = req.body.idAdmin;
    const usuario = req.body.usuario;
    const email = req.body.email;
    if(idAdmin && usuario && email){
        req.session.loggedin = true;
        req.session.username = usuario;
        req.session.idAdmin = idAdmin;
        req.session.email = email;
        res.status(200).send("Sesion sincronizada correctamente");
    }
    else{
        res.status(400).send("Datos de la sesion no encontrados");
    }
});

//Conexion para el deslogueo de la pagina
app.get("/logout", (req,res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    })
});

// Configurar puerto para servidor local
app.listen(4000,() => {
    console.log("El Servidor fue creado en http://localhost:4000");
});
