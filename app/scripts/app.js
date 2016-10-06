(function () {
  "use strict";

  window.App = {
    currentScene: null,
    scenes: {},
    isShown: true,

    initialize: function () {
      console.log('Initialization');
      this.$wrap = $('.wrap');
      this.$player = $('.player');

      this.$player.hide();

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

      
      $(document.body).on({
        // on keyboard 'd' by default
        'nav_key:blue': _.bind(this.toggleView, this),
        // remote events
        'nav_key:stop': function () {
          Player.stop();
        },
        'nav_key:pause': function () {
          Player.togglePause();
        },
        'nav_key:exit': function(){
          SB.exit();
        } 
      });


      // toggling background when player start/stop
      Player.on('ready', function () {
        $$log('player ready');
        console.log('player ready');
       
        var e = $.Event("keydown", { keyCode: 68}); //"keydown" if that's what you're doing
        $("body").trigger(e);
      });
      Player.on('stop', function () {
        $$log('player stop');
        console.log('player stop');
      });


      $('.nav-item:eq(0)').click();
    },

    toggleView: function () {
      console.log('Toggle view');
      if (this.isShown) {
          this.$wrap.hide();
          $$legend.hide();
          this.$player.show();
          $$nav.save();
          $$nav.on(this.$player);
      } else {
          this.$player.hide();
          this.$wrap.show();
          $$legend.show();
          $$nav.restore();
      }
      this.isShown = !this.isShown;
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