'use strict';

(function () {

  var mapPinsBlock = document.querySelector('.map__pins');

  window.utils = {
    MIN_LOCATION_X: 0,
    MAX_LOCATION_X: mapPinsBlock.clientWidth,
    MIN_LOCATION_Y: 130,
    MAX_LOCATION_Y: 630,
    ESC_KEYCODE: 27,
    data: []
  };

})();
