export default function ($scope, $http, $uibModal, $state) {
  	$scope.itemSeleccionado = [];
    $scope.itemsSeleccionados = [];
  	$scope.itemsSugeridos = [];


  	$scope.$watch('buscaItem', criterioBusqueda => {
    	$http.get('http://localhost:8090/busca-item', {
  			params: {"criterioBusqueda": encodeURI(criterioBusqueda)}
	    })
	    .then (function(response) {
          /*var items = response.data;

          for(var i = items.length - 1; i >= 0; i--) {
            if(items[i].existencias === 0) {
               items.splice(i, 1);
              }
          }

          console.log($scope.itemsSugeridos);*/

          $scope.itemsSugeridos = [];
      		//$scope.itemsSugeridos = items;
          $scope.itemsSugeridos = response.data;
    	});
  	});


    $scope.eliminaItemEntregaColegio = index => {
      $scope.itemsSeleccionados.splice(index, 1);
    }


  	$scope.onSeleccionaItemClick = item => {
      console.log(item);
      $scope.itemSeleccionado = [];
  		$scope.itemSeleccionado = item;
  		$scope.buscaItem = item.nombre_nav_item;
  		$scope.itemsSugeridos = [];

      $scope.itemCantidad = item.existencias;
      $scope.maxCantidad = item.existencias;
  	}


  	$scope.creaItemColegio = item => {

      if ($scope.librosForm.itemCantidad.$valid)
      {
        var dataItem = {
          "itemCantidad":$scope.itemCantidad,
          "idItem": $scope.itemSeleccionado.fk_id_item
        };

        item.cantidad_entrega_colegio_det = $scope.itemCantidad;

        if ( $scope.itemsSeleccionados.length == 0 )
        {
            $scope.itemsSeleccionados.push(item);
        }
        else
        {
          var flag = 0;
          for (var i=0; i<$scope.itemsSeleccionados.length; i++)
          {
            if ($scope.itemsSeleccionados[i].fk_id_item == $scope.itemSeleccionado.fk_id_item )
            {
              flag++;
            }
          }

          if (flag==0)
            $scope.itemsSeleccionados.push(item);
          else
            console.log("Item Repetido!!!");

        }

        $scope.buscaItem = [];
        $scope.itemCantidad = '';

        console.log($scope.itemsSeleccionados);
      }
      else
      {
        console.log("Invalid");
      }
  	}


    $scope.guardarEntregaColegio = function () {

      var modalInstance = $uibModal.open({
        animation: true,
        template: '<div class="modal-body">Guardando ...</div>',
        size: 80
      });


      $http({
            method: 'POST',
            url: 'http://localhost:8090/crea-muestra-colegio',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            params: {
              "fechaEntrega": $scope.fechaEntrega,
              "cliente": $scope.cliente,
              "responsable": $scope.responsable,
              "posicion": $scope.posicion,
              "telefono": $scope.telefono,
              "observaciones": $scope.observaciones,
              "itemsSeleccionados": angular.toJson($scope.itemsSeleccionados)
            }
        })
        .success(function (result) {
            modalInstance.close(result);
            $state.go('dashboard');
            console.log(result);
        });
    };

    $scope.selectedTestAccount = null;
    $scope.testAccounts = [];

    $http({
            method: 'GET',
            url: 'http://localhost:8090/cliente-read',
        }).success(function (result) {
        $scope.testAccounts = result;
    });

    







  // Código para funcionamiento de datepickup

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }








}