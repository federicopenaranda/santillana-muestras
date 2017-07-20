var express = require('express');
var session = require('express-session');
GLOBAL.mysql = require("mysql");
GLOBAL.sql = require('mssql');
var bodyParser = require("body-parser");
var app = express();
var moment = require('moment');
var _ = require('lodash');
var utils = require('./src/utils/utils');

moment().format();

var PORT = process.env.PORT || 3000;

// Las rutas estáticas deben estar antes del
// inicio de la sesión, si no es así se pierde la sesión
// luego de la ejecución de cada ruta.
app.use(express.static(__dirname + '/reportes'));


app.use(session({
    secret: 'asfasfa3asfa',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 2160000000
    }
}));
var sess;


app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(bodyParser.json());


// First you need to create a connection to the db
GLOBAL.pool = mysql.createPool({
	connectionLimit : 10,
  	//host: "192.168.100.150",
  	//host: "10.137.32.100",
  	multipleStatements: true,
  	host: "192.168.146.128",
  	user: "root",
  	password: "prueba-1",
  	database: "muestras",
  	acquireTimeout: 1000000
});


GLOBAL.pool.getConnection(function(err, connection) {
	if(err) throw err;
	console.log("Connected!");
});


GLOBAL.pool.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
});


// Rutas de Logueo
app.use(require("./src/routes/login"));

// Rutas de Muestras a Colegios
app.use(require("./src/routes/muestras-colegio"));

// Rutas Varias
app.use(require("./src/routes/otras"));

// Rutas: Delegados
app.use(require("./src/routes/delegados"));



app.get('/traspasos-read', function(req, res) {
	if (req.session.id_usuario)
	{
		utils.truncateEntregaDelegado(GLOBAL.pool, utils.getAlmacenUsuarios);
		res.json({"success": "true"});
	}
	else
	{
		res.json({"success": "false", "msg": "No estas logueado!"});
	}
});


app.get('/entregas-read', function(req, res) {
	console.log(req.session.id_usuario);
	if (req.session.id_usuario)
	{
		GLOBAL.pool.query('SELECT * FROM entrega_delegado WHERE fk_id_usuario = ' + req.session.id_usuario, function(err,rows){
		  if(err) throw err;
		  res.json(rows);
		});
	}
	else
	{
		res.json({"success": "false", "msg": "No estas logueado!"});
	}
});


app.get('/entregas-detalle', function(req, res) {
	if (req.session.id_usuario)
	{
		var query = 'SELECT\
					entrega_delegado_detalle.cantidad_entrega_delegado_detalle,\
					item.codigo_nav_item,\
					item.nombre_nav_item,\
					item.grupo_nav_item\
					FROM\
					entrega_delegado\
					INNER JOIN entrega_delegado_detalle ON entrega_delegado_detalle.fk_id_entrega_delegado = entrega_delegado.id_entrega_delegado\
					INNER JOIN item ON entrega_delegado_detalle.fk_id_item = item.id_item AND item.id_item = entrega_delegado_detalle.fk_id_item\
					WHERE\
					entrega_delegado.id_entrega_delegado = ' + req.query.fk_id_entrega_delegado;

		GLOBAL.pool.query(query,function(err,rows){
		  if(err) throw err;
		  res.json(rows);
		});
	}
	else
	{
		res.json({"success": "false", "msg": "No estas logueado!"});
	}
});


app.get('/entregas-colegio-cliente-read', function(req, res) {
	if (req.session.id_usuario)
	{
		GLOBAL.pool.query('SELECT \
				cliente.codigo_cliente_nav, \
				cliente.nombre_cliente, \
				cliente.id_cliente \
				FROM \
				entrega_colegio \
				INNER JOIN cliente ON entrega_colegio.fk_id_cliente = cliente.id_cliente \
				WHERE \
				entrega_colegio.fk_id_usuario = '+ req.session.id_usuario +' \
				GROUP BY \
				entrega_colegio.fk_id_cliente',function(err,rows){
		  if(err) throw err;
		  res.json(rows);
		});
	}
	else
	{
		res.json({"success": "false", "msg": "No estas logueado!"});
	}
});


app.get('/entregas-colegio-cliente-detalle', function(req, res) {
	if (req.session.id_usuario)
	{
		GLOBAL.pool.query('SELECT \
				Sum(entrega_colegio_det.cantidad_entrega_colegio_det) as total, \
				item.nombre_nav_item, \
				item.codigo_nav_item \
				FROM \
				entrega_colegio \
				INNER JOIN entrega_colegio_det ON entrega_colegio_det.fk_id_entrega_colegio = entrega_colegio.id_entrega_colegio \
				INNER JOIN item ON entrega_colegio_det.fk_id_item = item.id_item \
				WHERE \
				entrega_colegio.fk_id_usuario = '+ req.session.id_usuario +' AND \
				entrega_colegio.fk_id_cliente = ' + req.query.fk_id_cliente + '\
				GROUP BY \
				entrega_colegio_det.fk_id_item, \
				entrega_colegio.fk_id_cliente, \
				item.nombre_nav_item', function(err,rows){
		  if(err) throw err;
		  res.json(rows);
		});
	}
	else
	{
		res.json({"success": "false", "msg": "No estas logueado!"});
	}
});


app.get('/inventario-read', function(req, res) {

	var id_delegado;
	if (req.query.id_usuario == null || req.query.id_usuario == '')
	{
		id_delegado = req.session.id_usuario;
	}
	else
	{
		id_delegado = req.query.id_usuario;
	}



	if (id_delegado)
	{
		var query = 'SELECT * \
					FROM ( SELECT \
					entrega_delegado_detalle.fk_id_item, \
					sum(entrega_delegado_detalle.cantidad_entrega_delegado_detalle) as cantidad_entrega_delegado_detalle, \
					item.nombre_nav_item, \
					item.codigo_nav_item, \
					0 AS en_posesion \
					FROM \
					entrega_delegado \
					INNER JOIN entrega_delegado_detalle ON entrega_delegado_detalle.fk_id_entrega_delegado = entrega_delegado.id_entrega_delegado \
					INNER JOIN item ON entrega_delegado_detalle.fk_id_item = item.id_item \
					WHERE \
					entrega_delegado.fk_id_usuario = '+ id_delegado +' \
					GROUP BY \
					entrega_delegado_detalle.fk_id_item )  \
					as A LEFT JOIN \
					(SELECT \
					entrega_colegio_det.fk_id_item, \
					sum(entrega_colegio_det.cantidad_entrega_colegio_det) as cantidad_entrega_colegio_det, \
					sum(entrega_colegio_det.cantidad_devolucion_colegio_det) as cantidad_devolucion_colegio_det, \
					sum(entrega_colegio_det.cantidad_legalizacion_colegio_det) as cantidad_legalizacion_colegio_det \
					FROM entrega_colegio \
					INNER JOIN entrega_colegio_det ON entrega_colegio_det.fk_id_entrega_colegio = entrega_colegio.id_entrega_colegio \
					INNER JOIN item ON entrega_colegio_det.fk_id_item = item.id_item \
					WHERE entrega_colegio.fk_id_usuario = '+ id_delegado +' \
					group BY fk_id_item) \
					as B \
					on A.fk_id_item = B.fk_id_item';

		GLOBAL.pool.query(query, function(err,rows){
		  if(err) throw err;
		  res.json(rows);
		});
	}
	else
	{
		res.json({"success": "false", "msg": "No estas logueado!"});
	}
});











app.all('/*', function(req, res) {
    res.send('\
    	<!DOCTYPE html>\
		<html>\
		    <head>\
		        <title>Sistema de Muestras Santillana</title>\
		        <link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">\
		        <base href="/">\
		    </head>\
		    <body>\
		        <div ui-view></div>\
		        <script src="bundle.js"></script>\
		    </body>\
		</html>\
    	');
});


app.listen(PORT, function() {
    console.log('Server running on ' + PORT);
});