/* 	
 *	Script para CEP - teste
 * 	Rodrigo Portillo
 *	2018-11-29
*/

//Gerar dados locais caso não hajam
if(localStorage.addresses == undefined){
	localStorage.addresses = "[]";
}

//Iniciar App
var App = angular.module('testeCEP', []);

App.controller('checkZip', function($scope, $http){
	$scope.addresses = [];
	$scope.zip_class = "";
	
	$scope.norte = ['RO', 'AC', 'AM', 'RR', 'PA', 'AP', 'TO'];
	$scope.nordeste = ['PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA'];
	$scope.sul = ['PR', 'SC', 'RS'];
	$scope.suldeste = ['MG', 'ES', 'RJ', 'SP'];
	$scope.centro = ['MS', 'MT', 'GO', 'DF'];
	
	VMasker(document.querySelector("input#zip")).maskPattern("99999-999"); //Máscara
	    
    $scope.loadZip = function(){
	    if($scope.zip.length == 9){
			$http({
				method: 'GET',
				url: 'https://api.postmon.com.br/v1/cep/' + $scope.zip
			}).then(function (response){
				response.data.regiao = $scope.getRegiao(response.data.estado).nome;
				response.data.regiao_class = $scope.getRegiao(response.data.estado).slug;
				
				$scope.address = response.data
				$scope.addresses.unshift(response.data);
	
				localStorage.addresses = angular.toJson($scope.addresses);
				console.log($scope.addresses);
				$scope.loadAddresses();
				$scope.zip_class = "success";
			},function (error){
				$scope.msg = "CEP não encontrado";
				$scope.zip_class = "error";
			});
		}
	}
	
	$scope.loadAddresses = function(){
		$scope.addresses = JSON.parse(localStorage.addresses);
		console.log($scope.addresses);
		
		if($scope.addresses.length > 10){
			$scope.addresses.pop();
			localStorage.addresses = angular.toJson($scope.addresses);
		}
	}
	
	//init
	$scope.loadAddresses();
	
	$scope.getRegiao = function(uf){
		if($scope.norte.indexOf(uf) != -1){
			return {'slug': 'norte', 'nome' : 'Norte'};
		}else if($scope.nordeste.indexOf(uf) != -1){
			return {'slug': 'nordeste', 'nome' : 'Nordeste'};
		}else if($scope.sul.indexOf(uf) != -1){
			return {'slug': 'sul', 'nome' : 'Sul'};
		}else if($scope.suldeste.indexOf(uf) != -1){
			return {'slug': 'sudeste', 'nome' : 'Sudeste'};
		}else if($scope.centro.indexOf(uf) != -1){
			return {'slug': 'centro', 'nome' : 'Centro-oeste'};
		}
	}
});