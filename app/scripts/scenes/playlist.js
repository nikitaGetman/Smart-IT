(function () {
  "use strict";
  var _inited;

  var itemHtml = _.template('<div class="col-md-3" data-nav_type="vbox"> \
                  <div class="block nav-item video-item" data-url="<%=link%>" data-type="<%=type%>">\
                    <%=title%>\
                  </div>\
                </div>');

  var playlistHtml = _.template('<div class="nav-item playlist-item" data-content="<%=value%>"><%=value%></div>'); 

  window.App.scenes.playlist = {
    currentVideo : null,
    playlists: {},
    currentPlaylist: null,
    offset: 0,

    init: function () {
      this.$el = $('.scene-playlist');
      var self = this;
      
      this.$el.on('click', '.video-item', function(e){
        var url = e.currentTarget.getAttribute('data-url'),
            type = e.currentTarget.getAttribute('data-type');
        self.onItemClick(url, type);
      });
      this.$el.on('click', '.playlist-item', function(e){
        var new_playlist = e.currentTarget.getAttribute('data-content');
        self.onMenuClick(new_playlist);
      });

      this.getPlaylists();
      this.renderPlylists();
      this.$el.find('.playlist-item:eq(0)').click();

      window.addEventListener('playlist_change', function(e){
          console.log("Playlist change event");
          self.getPlaylists();
          self.currentPlaylist = self.playlists[0]['value'];
          self.renderPlylists();
          self.updateItems();
      });
      window.addEventListener('parameters_change', function(e){
          self.offset = 0;
          self.updateItems();
      });

      _inited = true;
    },
    show: function () {
      if (!_inited) {
        this.init();
      }

      this.$el.show();
    },
    hide: function () {
      this.$el.hide();
    },

    onItemClick: function(url, type){
      if(url !== null){
          if(this.currentVideo !== url){
            console.log("OnItemClick url = " + url);
            Player.play({
              url: url,
              type: type
            }); 

            this.currentVideo = url;
          }else{
            App.toggleView();
          }
      }      
    },
    onMenuClick: function(new_playlist){
        var current = this.currentPlaylist;

        console.log('Current = '+current + ", new = " + new_playlist);

        if(current !== new_playlist){
          if(new_playlist !== null){
            this.currentPlaylist = new_playlist;
            this.offset = 0;
            this.updateItems();
          }
        }
    },

    getPlaylists: function(){
        var list = App.config.checkedPlaylists;
        var res = [];
        for(var i =0; i < list.length; i++){
          res[i] = {"value" : list[i]};
        }
        this.playlists = res;
    },
    renderPlylists: function(){
        var playlists = this.playlists;
        var html = '';

        for(var i =0; i < playlists.length; i++){
          html += playlistHtml(playlists[i]);
        }

        this.$el.find('.menu-items')
            .empty()
            .html(html);
 
    },
    updateItems: function(){
      var params = JSON.stringify(App.config.checkedParameters);

      $.ajax({
        url: 'api/application.getByCategory',
        type: 'POST',
        data: {'parameters' : params, 'category' : this.currentPlaylist, 'offset' : this.offset},
        success: this.renderItems,
        context: this
      });
    },
    renderItems: function (items) {
      var html = '';

      if(items.length > 0){
        for ( var i = 0, len = items.length; i < len; i++ ) {
          html += itemHtml(items[i]);
          this.offset++;
        }
      }else{
        html = '<div class="text-center">Ничего не найдено</div>'
      }

      this.$el.find('.row')
        .empty()
        .html(html);
    }


  }
})();