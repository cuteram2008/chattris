(function(){
	var app = angular.module('gemStore', []);
	
		app.controller('TabController', function(){
		this.tab = 1;
		this.userlist = 1;

		this.setTab = function(newValue){
			this.tab = newValue;
		};

		this.isSet = function(tabName){
			return this.tab===tabName;
		};

		this.set = function(value) {
			this.userlist = value;
		};

		this.isuserset = function(value){
			return this.dropdown === value;
		};
  });
})();
