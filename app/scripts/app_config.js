(function () {
  "use strict";

  window.App.config = {
  	availiblePlaylists: [],
  	checkedPlaylists: [],
  	availibleParameters: [],
  	checkedParameters: [],
  	storage: [],
  	init: function(){
  		App.config.storage.storageAvailable('localStorage');
 		var params = this.getAllParameters();
 		this.getCheckedPlaylists();
 		this.getSearchParameters();
   	},
  	getAllParameters: function(){
  		// ajax to server
  		var res = {'playlists' : ['Android', 'iOS', 'Python', 'C++', 'Web'],
  				   'parameters' : {
  				   		'languages' : ['en', 'ru']
  				   		}
  				   };

		this.availiblePlaylists = res['playlists'];
		this.availibleParameters = res['parameters'];
  		return res;
  	},
  	getCheckedPlaylists: function(){
  		if(this.storage.isAvailible){
  			var str = localStorage.getItem('checked_playlists');
  			if(str == null || str == "[]"){
  				str = '["'+availiblePlaylists[0]+'"]';
  			}
  			var checked = JSON.parse(str);
  						// если выбранного плейлиста больше нет в общем массиве , то удаляем его
  			for(var i=0; i < checked.length; i++){
  				var index = this.availiblePlaylists.indexOf(checked[i]);
  				if(index < 0){
  					checked.splice(i, 1);
  				}
  			}

  			console.log('Checked playlists: ' + checked);
  			this.checkedPlaylists = checked;
  		}
  		else{
  		}
  	},
  	getSearchParameters: function(){
  		if(this.storage.isAvailible){
  			var str = localStorage.getItem('search_parameters');

  			console.log('Str parameters: ');
  			console.log(str);

  			if(str == null || str == "[]"){
  				str = '{"languages" : ["en", "ru"]}';
  			}
  			var param = JSON.parse(str);

  			for(var i=0; i < param.length; i++){
  				var index = this.availibleParameters.indexOf(param[i]);
  				if(index < 0){
  					delete param[i];
  					continue;
  				}

  				for(var j =0; j < param[i].length; j++){
  					index = this.availibleParameters[param[i]].indexOf(param[i][j]);
  					if(index < 0){
  						param[i].splice(j, 1);
  					}
  				}

  			}  			

  			console.log('Search parameters: ');
  			console.log(param);
  			this.checkedParameters = param;
  		}else{

  		}
  	},
  	setCheckedPlaylists: function(arr){
	    if(this.storage.isAvailible){
	    	var str = JSON.stringify(arr);
        	localStorage.setItem('checked_playlists', str);

        	this.checkedPlaylists = arr;

        	var event = new Event('playlist_change');
        	window.dispatchEvent(event); 
    	}
    	else{

    	}           
  	},
  	setSearchParameters: function(arr){
  		if(this.storage.isAvailible){
  			console.log(arr);
  			if(arr == []){
              arr = {'languages' : ['en']};
            }
            var str = JSON.stringify(arr);
            localStorage.setItem('search_parameters', str);

            this.searchParameters = arr;

            var event = new Event('parameters_change');
            window.dispatchEvent(event);
  		}else{

  		}
  	}
  };

  window.App.config.storage = {
  	isAvailible : false,

  	storageAvailable: function(type) {
		try {
			var storage = window[type],
				x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			this.isAvailible = true;
			return true;
		}
		catch(e) {
  			this.isAvailible = false;
			return false;
		}
	}
  };
})();