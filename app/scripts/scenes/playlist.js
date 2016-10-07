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
      
      this.$el.on('click', '.video-item', this.onItemClick);
      this.$el.on('click', '.playlist-item', this.onMenuClick);

      this.playlists = this.getPlaylists();
      self.currentPlaylist = 'Popular';
      this.renderPlylists(this.playlists);


      //this.currentPlaylist = 'All';
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

    onItemClick: function(e){
      var url = e.currentTarget.getAttribute('data-url');

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

    onMenuClick: function(e){
      // TODO: Stopped Here
        var self = this;
        var new_playlist = e.currentTarget.getAttribute('data-content'),
            current = self.currentPlaylist;

        console.log('Current = '+current + ", new = " + new_playlist);

        if(current !== new_playlist){
          if(new_playlist !== null){
            this.currentPlaylist = new_playlist;
          }
        }
    },

    getPlaylists: function(){
        return [{'value' : 'Popular'},
                {'value' : 'Algorithms'}, 
                {'value' : 'Web'},
                {'value' : 'Android'},
                {'value' : 'iOS'}];
    },
    renderPlylists: function(playlists){
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

      console.log(items);

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