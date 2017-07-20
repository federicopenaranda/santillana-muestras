export default function ($scope, $http) {
	$scope.entregasColegio = [];
	$scope.entregasColegioDetalle = [];


	$http({
	    method: 'GET',
	    url: 'http://localhost:8090/entregas-colegio-read'
  	})
    .then(function(entregas2) {
		$scope.entregasColegio = entregas2.data;
    })
    .catch(function(errRes) {
	      console.log("Error:");
	      console.log(errRes);
    });



    $scope.onColegioDetallesClick = entregaColegio => {
    	$scope.idEntregaColegioActual = entregaColegio.id_entrega_colegio;

		$http({
		    method: 'GET',
		    url: 'http://localhost:8090/entregas-colegio-detalle',
		    params: {fk_id_entrega_colegio: entregaColegio.id_entrega_colegio}
	  	})
	    .then(function(entregasColegioDetalle) {
			$scope.entregasColegioDetalle = entregasColegioDetalle.data;
	    })
	    .catch(function(errRes) {
		      console.log("Error:");
		      console.log(errRes);
	    });
	}


	$scope.onImprimirColegioDetallesClick = entregaColegio => {
		$http({
		    method: 'GET',
		    url: 'http://localhost:8090/imprime-entregas-colegio',
		    params: {
		    	fk_id_entrega_colegio: entregaColegio.id_entrega_colegio
		    }
	  	})
	    .then(function(reporte) {
			console.log(reporte);
			window.open('http://localhost:8090/' + reporte.data.file, '_blank', '');  
	    })
	    .catch(function(errRes) {
		      console.log("Error:");
		      console.log(errRes);
	    });
	}



    $scope.onDevolver = entregaColegioDetalle => {
		entregaColegioDetalle.devolver = true;
	}

    $scope.onLegalizar = entregaColegioDetalle => {
		entregaColegioDetalle.legalizar = true;
	}


	$scope.guardarDevolucion = entregaColegioDetalle => {
		entregaColegioDetalle.devolver = false;

		$http({
		    method: 'PUT',
		    url: 'http://localhost:8090/guarda-devolucion',
		    params: {
		    	id_entrega_colegio_det: entregaColegioDetalle.id_entrega_colegio_det,
	    		cantidad_devolucion_colegio_det: entregaColegioDetalle.cantidad_devolucion_colegio_det
		    }
	  	})
	  	.then(function successCallback(response) {
	  		console.log(response);
		}, function errorCallback(response) {
	  		console.log(response);
		});
	}


	$scope.guardarLegalizacion = entregaColegioDetalle => {
		entregaColegioDetalle.legalizar = false;

		$http({
		    method: 'PUT',
		    url: 'http://localhost:8090/guarda-legalizacion',
		    params: {
		    	id_entrega_colegio_det: entregaColegioDetalle.id_entrega_colegio_det,
	    		cantidad_legalizacion_colegio_det: entregaColegioDetalle.cantidad_legalizacion_colegio_det
		    }
	  	})
	  	.then(function successCallback(response) {
	  		console.log(response);
		}, function errorCallback(response) {
	  		console.log(response);
		});
	}


	$scope.onEliminaMuestraColegio = entregaColegio => {
		console.log(entregaColegio);
		console.log($scope.entregasColegio);

		$http({
		    method: 'DELETE',
		    url: 'http://localhost:8090/elimina-devolucion',
		    params: {
		    	id_entrega_colegio: entregaColegio.id_entrega_colegio
		    }
	  	})
	  	.then(function successCallback(response) {
	  		console.log(response);
	  		
	  		for (var i=0; i<=$scope.entregasColegio.length; i++)
	  		{
	  			if ($scope.entregasColegio[i].id_entrega_colegio == entregaColegio.id_entrega_colegio)
	  			{
	  				$scope.entregasColegio.splice(i,1);
	  			}
	  		}



		}, function errorCallback(response) {
	  		console.log(response);
		});
	}



}