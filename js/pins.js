'use strict';

(function () {

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var MAX_PINS_QUANTITY = 5;
  var clickedPin;

  var generatePin = function (pinTemplate, advertisementItem) {
    var newPin = pinTemplate.cloneNode(true);
    var newPinImg = newPin.querySelector('img');
    newPin.style.left = (advertisementItem.location.x - PIN_WIDTH / 2) + 'px';
    newPin.style.top = (advertisementItem.location.y - PIN_HEIGHT) + 'px';
    newPinImg.src = advertisementItem.author.avatar;
    newPinImg.alt = advertisementItem.offer.title;

    newPin.addEventListener('click', function () {
      if (clickedPin || clickedPin !== newPin) {
        window.card.close();
        window.card.render(advertisementItem);
        clickedPin = newPin;
        clickedPin.classList.add('map__pin--active');
      }
    });

    return newPin;
  };

  var createMapPins = function (pins) {
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();

    if (window.utils.pins.length === 0) {
      window.utils.pins = pins;
    }

    for (var i = 0; i < pins.slice(0, MAX_PINS_QUANTITY).length; i++) {
      if (pins[i].hasOwnProperty('offer')) {
        fragment.appendChild(generatePin(pinTemplate, pins[i]));
      }
    }

    window.map.pins.appendChild(fragment);
  };

  var resetClickedPin = function () {
    clickedPin = null;
  };

  window.pins = {
    create: createMapPins,
    reset: resetClickedPin
  };

})();
