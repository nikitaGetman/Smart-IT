(function () {
  "use strict";
  var _inited;

  window.App.scenes.playlist = {
    currentVideo : null,

    init: function () {
      console.log('Init scene playlist');
      this.$el = $('.scene-playlist');
      
      this.$el.on('click', '.video-item', this.onItemClick);

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
    }


  }
})();