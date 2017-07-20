export default function ($scope, $http) {
	$scope.entregas = [];
	$scope.entregasDetalle = [];

	$http({
	    method: 'GET',
	    url: 'http://localhost:8090/entregas-read'
  	})
    .then(function(entregas2) {
		$scope.entregas = entregas2.data;
    })
    .catch(function(errRes) {
	      console.log("Error:");
	      console.log(errRes);
    });



    $scope.onDetallesClick = entrega => {
		$http({
		    method: 'GET',
		    url: 'http://localhost:8090/entregas-detalle',
		    params: {fk_id_entrega_delegado: entrega.id_entrega_delegado}
	  	})
	    .then(function(entregasDetalle) {
			$scope.entregasDetalle = entregasDetalle.data;
	    })
	    .catch(function(errRes) {
		      console.log("Error:");
		      console.log(errRes);
	    });
	}

	
}