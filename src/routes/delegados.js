var express = require('express');
var session = require('express-session');
var router = new express.Router();


router.get('/delegados-read', function(req, res) {
	console.log(req.session.id_usuario);
	if (req.session.id_usuario)
	{
		GLOBAL.pool.query('SELECT usuario_00_01_01.primer_nombre_usuario, ' +
							'usuario_tipo_00_02_01.nombre_usuario_tipo, ' +
							'usuario_00_01_01.apellido_paterno_usuario, ' +
							'usuario_00_01_01.id_usuario ' +
							'FROM ' +
							'usuario_00_01_01 ' +
							'INNER JOIN usuario_cliente_region ON usuario_cliente_region.fk_id_usuario = usuario_00_01_01.id_usuario ' +
							'INNER JOIN usuario_tipo_usuario_00_01_02 ON usuario_tipo_usuario_00_01_02.fk_id_usuario = usuario_00_01_01.id_usuario ' +
							'INNER JOIN usuario_tipo_00_02_01 ON usuario_tipo_usuario_00_01_02.fk_id_usuario_tipo = usuario_tipo_00_02_01.id_usuario_tipo ' +
							'WHERE ' +
							'usuario_cliente_region.fk_id_cliente_region IN(SELECT ' +
								'usuario_cliente_region.fk_id_cliente_region ' +
								'FROM ' +
								'usuario_00_01_01 ' +
								'INNER JOIN usuario_cliente_region ON usuario_cliente_region.fk_id_usuario = usuario_00_01_01.id_usuario ' +
								'INNER JOIN usuario_tipo_usuario_00_01_02 ON usuario_tipo_usuario_00_01_02.fk_id_usuario = usuario_00_01_01.id_usuario ' +
								'INNER JOIN usuario_tipo_00_02_01 ON usuario_tipo_usuario_00_01_02.fk_id_usuario_tipo = usuario_tipo_00_02_01.id_usuario_tipo ' +
								'WHERE ' +
								'usuario_00_01_01.id_usuario = '+ req.session.id_usuario + ') AND ' +
							'usuario_tipo_00_02_01.nombre_usuario_tipo = \'delegado\'', function(err,rows){
		  if(err) throw err;
		  console.log(rows);
		  res.json(rows);
		});
	}
	else
	{
		res.json({"success": "false", "msg": "No estas logueado!"});
	}
});

module.exports = router;