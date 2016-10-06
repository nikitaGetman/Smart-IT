(function () {
  "use strict";


  window.App = {
    currentScene: null,
    scenes: {},
    isShown: true,

    initialize: function () {
      console.log('Initialization');
      //this.$wrap = $('.wrap');

      $$legend.show();

      this.setEvents();

      // start navigation
      $$nav.on();
    },

    setEvents: function () {
      var self = this;

      // click on menu item
      $('.menu-navigation').on('click', '.nav-item', function ( e ) {
        var scene = e.currentTarget.getAttribute('data-content');
        self.showContent(scene);
      });

      $('.nav-item:eq(0)').click();
    },

    showContent: function ( scene ) {
      var cur = this.currentScene,
        newScene = this.scenes[scene];

      if ( cur !== newScene ) {
        if ( !newScene ) {
          console.log('Scene ' + scene + ' doesn`t exist');
          $$error('Scene ' + scene + ' doesn\'t exist');
        } else {
          if ( cur ) {
            cur.hide();
          }
          newScene.show();
          this.currentScene = newScene;
        }
      }
    }
  };

  // main app initialize when smartbox ready
  SB(_.bind(App.initialize, App));
})();