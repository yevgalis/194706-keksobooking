'use strict';

(function () {

  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var mainMapPin = window.utils.mapData.mapPins.querySelector('.map__pin--main');

  var onMainPinMouseDown = function (evt) {
    evt.preventDefault();

    window.utils.mapData.map.classList.remove('map--faded');
    window.utils.forms.adForm.classList.remove('ad-form--disabled');
    window.utils.functions.manageFormInputs(window.utils.forms.mapFiltersFormSelects, false);
    window.utils.forms.mapFiltersFormFieldset.disabled = false;
    window.utils.functions.manageFormInputs(window.utils.forms.adFormFieldsets, false);
    window.utils.functions.renderElement(window.utils.mapData.mapPins, window.pins.createMapPins());

    var pinCoordinates = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onDocumentMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: pinCoordinates.x - moveEvt.clientX,
        y: pinCoordinates.y - moveEvt.clientY
      };

      pinCoordinates = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var topPosition = mainMapPin.offsetTop - shift.y;
      var leftPosition = mainMapPin.offsetLeft - shift.x;

      if (topPosition < (window.utils.constants.MIN_LOCATION_Y - MAIN_PIN_HEIGHT)) {
        topPosition = window.utils.constants.MIN_LOCATION_Y - MAIN_PIN_HEIGHT;
      } else if (topPosition > (window.utils.constants.MAX_LOCATION_Y - MAIN_PIN_HEIGHT)) {
        topPosition = window.utils.constants.MAX_LOCATION_Y - MAIN_PIN_HEIGHT;
      }

      if (leftPosition < (window.utils.constants.MIN_LOCATION_X - MAIN_PIN_WIDTH / 2)) {
        leftPosition = window.utils.constants.MIN_LOCATION_X - MAIN_PIN_WIDTH / 2;
      } else if (leftPosition > (window.utils.constants.MAX_LOCATION_X - MAIN_PIN_WIDTH / 2)) {
        leftPosition = window.utils.constants.MAX_LOCATION_X - MAIN_PIN_WIDTH / 2;
      }

      mainMapPin.style.top = topPosition + 'px';
      mainMapPin.style.left = leftPosition + 'px';

      window.utils.forms.adFormAddress.value = Math.floor((mainMapPin.offsetLeft + MAIN_PIN_WIDTH / 2)) + ', ' + Math.floor((mainMapPin.offsetTop + MAIN_PIN_HEIGHT));
    };

    var onDocumentMouseUp = function (upEvt) {
      upEvt.preventDefault();

      window.utils.forms.adFormAddress.value = Math.floor((mainMapPin.offsetLeft + MAIN_PIN_WIDTH / 2)) + ', ' + Math.floor((mainMapPin.offsetTop + MAIN_PIN_HEIGHT));

      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
    };

    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  };

  mainMapPin.addEventListener('mousedown', onMainPinMouseDown);

})();
