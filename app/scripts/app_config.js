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
	    
      $.ajaxSetup({        
        dataFilter: function(data, type){
          //console.log(data);
          var res = JSON.parse(data);
          if(res['error']){
            console.log('Respinse error ' + res['error']['code'] + ': ' + res['error']['text']);
            $$error('Respinse error ' + res['error']['code'] + ': ' + res['error']['text']);
            return false;
          }
          return res['response']['result'];
        },
        error: function(jqXHR, textStatus, errorThrown){
          console.log(textStatus);
          $$error(textStatus);
        }
      });
      
      this.getAllParameters();
 		  this.getCheckedPlaylists();
 		  this.getSearchParameters();
   	},
  	getAllParameters: function(){
  		/* ajax to server
  		var res = {'playlists' : ['Android', 'iOS', 'Python', 'C++', 'Web'],
  				   'parameters' : {
  				   		'languages' : ['en', 'ru']
  				   		}
  				   };
      */
      var self = this;

      $.ajax({url: 'api/application.getAllParameters',
              async : false,
              success: function(data){
                if(!data) return false;

                self.availiblePlaylists = data['playlists'];
                self.availibleParameters = data['parameters'];
              }
      });
  	},
  	getCheckedPlaylists: function(){
  		if(this.storage.isAvailible){
  			var str = localStorage.getItem('checked_playlists');
  			if(str == null || str == "[]"){
  				str = '["'+this.availiblePlaylists[0]+'"]';
  			}
  			var checked = JSON.parse(str);
  						// если выбранного плейлиста больше нет в общем массиве , то удаляем его
  			for(var i=0; i < checked.length; i++){
  				var index = this.availiblePlaylists.indexOf(checked[i]);
  				if(index < 0){
  					checked.splice(i, 1);
  				}
  			}

  			this.checkedPlaylists = checked;
  		}
  		else{
  		}
  	},
  	getSearchParameters: function(){
  		if(this.storage.isAvailible){
  			var str = localStorage.getItem('search_parameters');

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

  			this.checkedParameters = param;
  		}else{

  		}
  	},
  	setCheckedPlaylists: function(arr){
	    if(this.storage.isAvailible){
        if(_.difference(this.checkedPlaylists, arr).length > 0 || _.difference(arr, this.checkedPlaylists).length > 0){

	    	  var str = JSON.stringify(arr);
        	localStorage.setItem('checked_playlists', str);

        	this.checkedPlaylists = arr;

        	var event = new Event('playlist_change');
        	window.dispatchEvent(event); 
        }
        else{
          console.log('setCheckedPlaylists: Nothing is change');
        }
    	}
    	else{

    	}           
  	},
  	setSearchParameters: function(arr){
      var is_changed = false;
      for(var item in arr){
        if(_.difference(this.checkedParameters[item], arr[item]).length > 0 || _.difference(arr[item], this.checkedParameters[item]).length > 0){
            is_changed = true;
            break;
        }
      }

  		if(this.storage.isAvailible){
        if(is_changed){

			    if(arr == []){
            arr = {'languages' : ['en']};
          }
          var str = JSON.stringify(arr);
          localStorage.setItem('search_parameters', str);

          this.checkedParameters = arr;

          var event = new Event('parameters_change');
          window.dispatchEvent(event);
        }
        else{
             console.log('setCheckedParameters: Nothing is change');
        }
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