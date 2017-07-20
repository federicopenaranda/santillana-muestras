export default function ($scope, $http) {

    $scope.onImportarMuestrasDelegadosClick = function () {
		$http({
		    method: 'GET',
		    url: 'http://localhost:8090/traspasos-read'
	  	})
	    .then(function(result) {
			console.log(result);
	    })
	    .catch(function(errRes) {
		      console.log("Error:");
		      console.log(errRes);
	    });
	}

	
}