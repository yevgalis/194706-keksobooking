'use strict';

(function () {

  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var clickedPin;

  var generatePin = function (pinTemplate, advertisementItem) {
    var newPin = pinTemplate.cloneNode(true);
    var newPinImg = newPin.querySelector('img');
    newPin.style.left = (advertisementItem.location.x - PIN_WIDTH / 2) + 'px';
    newPin.style.top = (advertisementItem.location.y - PIN_HEIGHT) + 'px';
    newPinImg.src = advertisementItem.author.avatar;
    newPinImg.alt = advertisementItem.offer.title;

    newPin.addEventListener('click', function () {
      if (!window.pins.active || window.pins.active !== newPin) {
        window.card.close();
        window.card.render(advertisementItem);
        window.pins.active = newPin;
      }
    });

    return newPin;
  };

  var createMapPins = function () {
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < window.data.length; i++) {
      fragment.appendChild(generatePin(pinTemplate, window.data[i]));
    }

    return fragment;
  };

  var resetClickedPin = function () {
    window.pins.active = null;
  };

  window.pins = {
    active: clickedPin,
    create: createMapPins,
    reset: resetClickedPin
  };

})();