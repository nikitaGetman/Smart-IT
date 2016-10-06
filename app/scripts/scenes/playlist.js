(function () {
  "use strict";
  var _inited;

  window.App.scenes.playlist = {
    init: function () {
      console.log('Init scene playlist');
      this.$el = $('.scene-playlist');
      
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
    }
  }
})();