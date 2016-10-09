(function () {
  "use strict";
  var _inited;

  window.App.scenes.settings = {
    currentModule: null,

    init: function () {
      console.log('Init scene settings');
      this.$el = $('.scene-settings');
      var self = this;

      ////// Categories update
      var box = this.$el.find('.module-categories').find('.box'),
          all_pl = App.config.availiblePlaylists,
          ch_pl = App.config.checkedPlaylists;

      var html = "";
      for(var i=0; i < all_pl.length; i++){
          var index = ch_pl.indexOf(all_pl[i]);
          html += '<p class="nav-item input-item '+(index < 0 ? '' : 'checked')+'" data-content="'+all_pl[i]+'">'+all_pl[i]+'</p>';
      }
      box.empty().html(html);
      ////////////////////////////

      ///// Search parameters update
      var box = this.$el.find('.module-search_parameters').find('.box'),
          all_pr = App.config.availibleParameters,
          ch_pr = App.config.checkedParameters;

        var html = "";
        var iter = 0;
        for(var item in all_pr){
          html += '<div data-content="'+item+'"><h2>'+item+':</h2>';
          
          for (var j = 0; j < all_pr[item].length; j++) {
            var index;
            if(ch_pr[item].length >= j) {
              index = ch_pr[item].indexOf(all_pr[item][j]);
            }else {
              index = -1;
            }
            html += '<p class="nav-item input-item '+(index < 0 ? '' : 'checked')+'" data-content="'+all_pr[item][j]+'">'+all_pr[item][j]+'</p>'
          }

          html += '</div>';
          iter++;
        }  
        console.log('html: ' + html);        
        box.empty().html(html);
      ////////////////////////////////



      this.$el.on('click', '.leftbar-item', function(e){
        var module = e.currentTarget.getAttribute('data-content');
        self.onMenuClick(module);
      });
      this.$el.find('.module').hide();
      this.$el.find('.leftbar-item:eq(0)').click();

      this.$el.find('.input-item').on('click', function(e){
          $(this).toggleClass('checked');
      }); 


      _inited = true;
    },

    onMenuClick: function(module){
      var cur = this.currentModule;

      if ( cur !== module ) {
        if ( !module ) {
          console.log('Module ' + e + ' doesn`t exist');
          $$error('Scene ' + e + ' doesn\'t exist');
        } else {
          if ( cur ) {
            $('.module-' + cur).hide();
            this.save();
          }

          $('.module-' + module).show();
          this.currentModule = module;
        }
      }
    },

    save: function(){
        if(this.currentModule == 'categories'){
          var form = $('.module-'+this.currentModule).find('.box').children('.checked');
          var array_of_checked = [];
          for(var i =0; i < form.length; i++){
            array_of_checked[i] = form[i].getAttribute('data-content');
          }
          App.config.setCheckedPlaylists(array_of_checked);
        }
        if(this.currentModule == 'search_parameters'){
          var form = $('.module-'+this.currentModule).find('.box').children();

          var array = {};

          for(var i =0; i < form.length; i++){
            var checked = form.children('.checked');
            var array_of_checked = [];
            for(var j =0; j < checked.length; j++){
              array_of_checked[j] = checked[j].getAttribute('data-content');
            }
            array[form[i].getAttribute('data-content')] = array_of_checked;
          }
          App.config.setSearchParameters(array); 
        }
    },

    show: function () {
      if (!_inited) {
        this.init();
      }

      this.$el.show();
    },
    hide: function () {
      this.save();
      this.$el.hide();
    }
  }
})();