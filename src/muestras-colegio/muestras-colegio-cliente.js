export default function ($scope, $http) {
	$scope.entregasCliente = [];
	$scope.entregasClienteDetalle = [];


	$http({
	    method: 'GET',
	    url: 'http://localhost:8090/entregas-colegio-cliente-read'
  	})
    .then(function(entregas2) {
		$scope.entregasCliente = entregas2.data;
    })
    .catch(function(errRes) {
	      console.log("Error:");
	      console.log(errRes);
    });



    $scope.onClienteDetallesClick = entregaCliente => {
    	$scope.idClienteActual = entregaCliente.id_cliente;

		$http({
		    method: 'GET',
		    url: 'http://localhost:8090/entregas-colegio-cliente-detalle',
		    params: {fk_id_cliente: entregaCliente.id_cliente}
	  	})
	    .then(function(entregasClienteDetalle) {
			$scope.entregasClienteDetalle = entregasClienteDetalle.data;
	    })
	    .catch(function(errRes) {
		      console.log("Error:");
		      console.log(errRes);
	    });
	}


}