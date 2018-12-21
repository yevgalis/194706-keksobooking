'use strict';

(function () {

  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 83;
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mainMapPin = mapPins.querySelector('.map__pin--main');
  var MAIN_PIN_START_X = mainMapPin.style.left;
  var MAIN_PIN_START_Y = mainMapPin.style.top;

  var hideMap = function () {
    map.classList.add('map--faded');
  };

  var setMainPinDefaultPosition = function () {
    mainMapPin.style.left = MAIN_PIN_START_X;
    mainMapPin.style.top = MAIN_PIN_START_Y;
  };

  var onMainPinMouseDown = function (evt) {
    evt.preventDefault();

    var showError = function (message) {
      var errorTemplate = window.form.error.cloneNode(true);
      var errorTemplateText = errorTemplate.querySelector('.error__message');
      var errorTemplateButton = errorTemplate.querySelector('.error__button');

      errorTemplateText.textContent = message;
      errorTemplateButton.textContent = 'Закрыть';

      var deleteErrorMessage = function () {
        errorTemplate.remove();
        document.removeEventListener('click', onDocumentClick);
        document.removeEventListener('keydown', onDocumentKeydown);
      };

      var onDocumentClick = function () {
        deleteErrorMessage();
      };

      var onDocumentKeydown = function (keyEvt) {
        if (keyEvt.keyCode === window.utils.ESC_KEYCODE) {
          deleteErrorMessage();
        }
      };

      errorTemplateButton.addEventListener('click', function (errEvt) {
        errEvt.preventDefault();
        errorTemplate.remove();
      });

      document.addEventListener('click', onDocumentClick);
      document.addEventListener('keydown', onDocumentKeydown);

      document.body.appendChild(errorTemplate);
    };

    map.classList.remove('map--faded');
    window.form.activateForms();
    window.backend.getData(window.pins.create, showError);

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

      if (topPosition < (window.utils.MIN_LOCATION_Y - MAIN_PIN_HEIGHT)) {
        topPosition = window.utils.MIN_LOCATION_Y - MAIN_PIN_HEIGHT;
      } else if (topPosition > (window.utils.MAX_LOCATION_Y - MAIN_PIN_HEIGHT)) {
        topPosition = window.utils.MAX_LOCATION_Y - MAIN_PIN_HEIGHT;
      }

      if (leftPosition < (window.utils.MIN_LOCATION_X - MAIN_PIN_WIDTH / 2)) {
        leftPosition = window.utils.MIN_LOCATION_X - MAIN_PIN_WIDTH / 2;
      } else if (leftPosition > (window.utils.MAX_LOCATION_X - MAIN_PIN_WIDTH / 2)) {
        leftPosition = window.utils.MAX_LOCATION_X - MAIN_PIN_WIDTH / 2;
      }

      mainMapPin.style.top = topPosition + 'px';
      mainMapPin.style.left = leftPosition + 'px';

      window.form.setMapAddress(Math.floor((mainMapPin.offsetLeft + MAIN_PIN_WIDTH / 2)), Math.floor((mainMapPin.offsetTop + MAIN_PIN_HEIGHT)));
    };

    var onDocumentMouseUp = function (upEvt) {
      upEvt.preventDefault();

      window.form.setMapAddress(Math.floor((mainMapPin.offsetLeft + MAIN_PIN_WIDTH / 2)), Math.floor((mainMapPin.offsetTop + MAIN_PIN_HEIGHT)));

      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
    };

    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  };

  mainMapPin.addEventListener('mousedown', onMainPinMouseDown);
  window.map = {
    view: map,
    pins: mapPins,
    mainPin: mainMapPin,
    setMainPinDefaultPosition: setMainPinDefaultPosition,
    hide: hideMap
  };

})();
