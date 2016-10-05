// global SB
!(function ( window, undefined ) {

  var PlatformApi = {
    externalCss: [],
    externalJs: [],
    keys: {},

    DUID: '',

    platformUserAgent: 'not found',

    /**
     * Get DUID in case of Config
     * @return {string} DUID
     */
    getDUID: function () {
      switch ( SB.config.DUID ) {
        case 'real':
          this.DUID = this.getNativeDUID();
          break;
        case 'mac':
          this.DUID = this.getMac();
          break;
        case 'random':
          this.DUID = this.getRandomDUID();
          break;
        /*case 'local_random':
         this.DUID = this.getLocalRandomDUID();
         break;*/
        default:
          this.DUID = Config.DUIDSettings;
          break;
      }

      return this.DUID;
    },

    getSDI: function () {
      return '';
    },

    /**
     * Returns random DUID for platform
     * @returns {string}
     */
    getRandomDUID: function () {
      return (new Date()).getTime().toString(16) + Math.floor(Math.random() * parseInt("10000", 16)).toString(16);
    },

    /**
     * Returns MAC for platform if exist
     * @returns {string}
     */
    getMac: function () {
      return '';
    },

    /**
     * Returns native DUID for platform if exist
     * @returns {string}
     */
    getNativeDUID: function () {
      return '';
    },

    /**
     * Set custom plugins for platform
     */
    setPlugins: $.noop,

    // TODO: volume for all platforms
    volumeUp: $.noop,
    volumeDown: $.noop,
    getVolume: $.noop,
    exit: $.noop,
    sendReturn: $.noop,
    setData: function ( name, val ) {
      // save data in string format
      localStorage.setItem(name, JSON.stringify(val));
    },

    getData: function ( name ) {
      var result;
      try {
        result = JSON.parse(localStorage.getItem(name));
      } catch (e) {
      }

      return result;
    },

    removeData: function ( name ) {
      localStorage.removeItem(name);
    }
  };

  _.extend(SB, PlatformApi);
})(this);