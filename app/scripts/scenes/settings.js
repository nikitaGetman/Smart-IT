(function () {
  "use strict";
  var _inited;

  window.App.scenes.settings = {
    init: function () {
      console.log('Init scene settings');
      this.$el = $('.scene-settings');
      
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