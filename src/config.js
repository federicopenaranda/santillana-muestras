import angular from 'angular';
import uiRouter from 'angular-ui-router';
import muestrasDelegadoController from 'muestras-delegado/muestras-delegado';
import muestrasColegioController from 'muestras-colegio/muestras-colegio';
import muestrasColegioClienteController from 'muestras-colegio/muestras-colegio-cliente';
import creaMuestraColegioController from 'muestras-colegio/crear-muestra-colegio';
import inventarioController from 'inventario/inventario';
import loginController from 'login/login';
import salirController from 'login/salir';
import dashboardController from 'dashboard/dashboard';
import importarMuestrasDelegadoController from 'muestras-delegado/importar-muestras-delegado';
import sincronizaProductosController from 'sincroniza-productos/sincroniza-productos';
import datepicker from 'angular-ui-bootstrap/src/datepickerPopup';
import modal from 'angular-ui-bootstrap/src/modal';
var uiBootstrap = require('angular-ui-bootstrap');

const app = angular.module('app', [uiBootstrap, uiRouter, datepicker, modal]);

app.config(($stateProvider, $urlRouterProvider, $locationProvider, $controllerProvider) => {
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('login', {
			url: '/',
			template: require('login/login.html'),
			controller: loginController
		})
		.state('salir', {
			url: '/salir',
			//template: require('dashboard/dashboard.html'),
			controller: salirController
		})
		.state('dashboard', {
			url: '/dashboard',
			template: require('dashboard/dashboard.html'),
			controller: dashboardController
		})
		.state('muestras-delegado', {
			url: '/muestras-delegado',
			template: require('muestras-delegado/muestras-delegado.html'),
			controller: muestrasDelegadoController
		})
		.state('importar-muestras-delegado', {
			url: '/importar-muestras-delegado',
			template: require('muestras-delegado/importar-muestras-delegado.html'),
			controller: importarMuestrasDelegadoController
		})
		.state('sincroniza-productos', {
			url: '/sincroniza-productos',
			template: require('sincroniza-productos/sincroniza-productos.html'),
			controller: sincronizaProductosController
		})
		.state('muestras-colegio', {
			url: '/muestras-colegio',
			template: require('muestras-colegio/muestras-colegio.html'),
			controller: muestrasColegioController
		})
		.state('muestras-colegio-cliente', {
			url: '/muestras-colegio-cliente',
			template: require('muestras-colegio/muestras-colegio-cliente.html'),
			controller: muestrasColegioClienteController
		})
		.state('inventario', {
			url: '/inventario',
			template: require('inventario/inventario.html'),
			controller: inventarioController
		})
		.state('crear-muestra-colegio', {
			url: '/crear-muestra-colegio',
			template: require('muestras-colegio/crear-muestra-colegio.html'),
			controller: creaMuestraColegioController
		});




	$locationProvider.html5Mode(true);

} );

export default app;