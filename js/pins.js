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
      // if (!window.pins.clickedPin || window.pins.clickedPin !== newPin) {
      //   window.card.closeCard();
      //   window.card.renderMapCard(advertisementItem);
      //   window.pins.clickedPin = newPin;
      // }
      if (!window.pins.clicked || window.pins.clicked !== newPin) {
        window.card.close();
        window.card.render(advertisementItem);
        window.pins.clicked = newPin;
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
    // window.pins.clickedPin = null;
    window.pins.clicked = null;
  };

  // window.pins = {
  //   clickedPin: clickedPin,
  //   createMapPins: createMapPins,
  //   resetClickedPin: resetClickedPin
  // };

  window.pins = {
    clicked: clickedPin,
    create: createMapPins,
    reset: resetClickedPin
  };

})();
