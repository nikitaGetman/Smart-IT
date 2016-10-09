(function () {
  "use strict";
  var _inited;

  var itemHtml = _.template('<div class="col-md-3" data-nav_type="vbox"> \
                  <div class="block nav-item video-item" data-url="<%=url%>" data-type="<%=type%>">\
                    <%=title%>\
                  </div>\
                </div>');

  var playlistHtml = _.template('<div class="nav-item playlist-item" data-content="<%=value%>"><%=value%></div>'); 

  window.App.scenes.playlist = {
    currentVideo : null,
    playlists: {},
    currentPlaylist: null,

    init: function () {
      this.$el = $('.scene-playlist');
      var self = this;
      
      this.$el.on('click', '.video-item', function(e){
        var url = e.currentTarget.getAttribute('data-url');
        self.onItemClick(url);
      });
      this.$el.on('click', '.playlist-item', function(e){
        var new_playlist = e.currentTarget.getAttribute('data-content');
        self.onMenuClick(new_playlist);
      });

      this.getPlaylists();
      this.currentPlaylist = this.playlists[0]['value'];
      this.renderPlylists();

      window.addEventListener('playlist_change', function(e){
          self.getPlaylists();
          self.currentPlaylist = self.playlists[0]['value'];
          self.renderPlylists();
      });

      console.log('current playlist = ' + this.currentPlaylist);

      var response = this.updateItems();
      this.renderItems(response);

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

    onItemClick: function(url){
      if(url !== null){
          if(this.currentVideo !== url){
            console.log("OnItemClick url = " + url);

            Player.play({
              url: url,
              type: e.currentTarget.getAttribute('data-type')
            });  
            this.currentVideo = url;
          }else{
            var e = $.Event("keydown", { keyCode: 68}); //"keydown" if that's what you're doing
            $("body").trigger(e);
          }
      }      
    },
    onMenuClick: function(new_playlist){
      // TODO: Stopped Here
        var current = this.currentPlaylist;

        console.log('Current = '+current + ", new = " + new_playlist);

        if(current !== new_playlist){
          if(new_playlist !== null){
            this.currentPlaylist = new_playlist;
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
      // ajax here
      return [{'url' : 'test_video.mp4', 'type' : 'hls', 'title' : 'Test'},
              {'url' : 'test_video.mp4', 'type' : 'vod', 'title' : 'Emirates Preview'}];
    },
    renderItems: function (items) {
      var html = '';

       // console.log(items, itemHtml.toString())
      for ( var i = 0, len = items.length; i < len; i++ ) {
        html += itemHtml(items[i]);
      }

      this.$el.find('.row')
        .empty()
        .html(html);
    }


  }
})();