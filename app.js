// importar la libreria
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');


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


//Middleware o Ruta de archivos estáticos
app.use(express.static("public"));

app.get("/", (req,res) => {

    const PostPlayers = "SELECT * FROM PostPlayers"

    connection.query(PostPlayers, (err, Post) => {
        if(err){
            res.status(500).send('Error database');
            return;
        }else{
            res.render('index', { Post });
        }
    });
});

app.get("/Equipos", (req, res) => {
    res.render('Equipos');
});

app.get("/Redes", (req, res) => {
    res.render('Redes');
});

app.get("/Contenido", (req, res) => {
    res.render('Contenido');
});

app.get("/Formulario", (req, res) => {
    res.render('Formulario');
});

app.use((req,res,next) => {
    res.status(404).render("404");
});

// Configurar puerto para servidor local
app.listen(3000,function(){
    console.log("El Servidor fue creado en http://localhost:3000");
});