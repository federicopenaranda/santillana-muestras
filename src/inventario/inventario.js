export default function ($rootScope, $scope, $http) {

/*	$scope.inventario = {};
	$scope.inventarioPrivilegio = ($rootScope.privilegios.indexOf("menu_inventario")) != -1 ? true : false;

	console.log("$scope.inventarioPrivilegio");
	console.log($rootScope.privilegios.indexOf("menu_inventario"));*/

	$scope.delegados = [];

	$http({
            method: 'GET',
            url: 'http://localhost:8090/delegados-read',
        }).success(function (result) {
        $scope.delegados = result;
    });



	$http({
	    method: 'GET',
	    url: 'http://10.137.32.140:8100/inventario-read',
	    params: {'id_usuario': ''}
  	})
    .then(function(inventario) {
    	//console.log($rootScope.privilegios);
		$scope.inventario = inventario.data;
    })
    .catch(function(errRes) {
	      console.log("Error:");
	      console.log(errRes);
    });


	$scope.muestraInventarioDelegado = delegado => {

		console.log ('En muestraInventarioDelegado');

		if (delegado)
		{
			$http({
			    method: 'GET',
			    url: 'http://10.137.32.140:8100/inventario-read',
			    params: {'id_usuario': delegado.id_usuario}
		  	})
		    .then(function(inventario) {
		    	//console.log($rootScope.privilegios);
				$scope.inventario = inventario.data;
		    })
		    .catch(function(errRes) {
			      console.log("Error:");
			      console.log(errRes);
		    });
		}
  	}


}