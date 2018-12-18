'use strict';

(function () {

  var APPARTMENT_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var APPARTMENT_TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECK_IN_OUT_TIMES = ['12:00', '13:00', '14:00'];
  var APPARTMENT_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var APPARTMENT_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var NUMBER_OF_OBJECTS = 8;
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var MIN_ROOMS = 1;
  var MAX_ROOMS = 5;
  var MIN_GUESTS = 0;
  var MAX_GUESTS = 10;
  var appartmentTitlesCopy = APPARTMENT_TITLES.slice(); // To save original arrays

  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  var getAppartmentTitles = function (arr) {
    var index = getRandomNumber(0, arr.length - 1);
    var value = arr[index];
    arr.splice(index, 1);
    return value;
  };

  var getRandomArrayElement = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  var getChangedArray = function (arr) {
    var arrayCopy = arr.slice();
    var count = getRandomNumber(0, arrayCopy.length); // number of features to delete

    for (var i = 0; i < count; i++) {
      arrayCopy.splice(getRandomNumber(0, arrayCopy.length - 1), 1);
    }

    return arrayCopy;
  };

  var shuffleArray = function (arr) {
    var arrayCopy = arr.slice();
    var currentIndex = arrayCopy.length;
    var temporaryValue;
    var randomIndex;
    var zero = 0;

    while (zero !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = arrayCopy[currentIndex];
      arrayCopy[currentIndex] = arrayCopy[randomIndex];
      arrayCopy[randomIndex] = temporaryValue;
    }

    return arrayCopy;
  };

  var generateObject = function (num) {
    var locationX = getRandomNumber(window.utils.MIN_LOCATION_X, window.utils.MAX_LOCATION_X);
    var locationY = getRandomNumber(window.utils.MIN_LOCATION_Y, window.utils.MAX_LOCATION_Y);

    return {
      'author': {
        'avatar': 'img/avatars/user0' + num + '.png'
      },
      'offer': {
        'title': getAppartmentTitles(appartmentTitlesCopy),
        'address': locationX + ', ' + locationY,
        'price': getRandomNumber(MIN_PRICE, MAX_PRICE),
        'type': getRandomArrayElement(APPARTMENT_TYPES),
        'rooms': getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        'guests': getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        'checkin': getRandomArrayElement(CHECK_IN_OUT_TIMES),
        'checkout': getRandomArrayElement(CHECK_IN_OUT_TIMES),
        'features': getChangedArray(APPARTMENT_FEATURES),
        'description': '',
        'photos': shuffleArray(APPARTMENT_PHOTOS)
      },
      'location': {
        'x': locationX,
        'y': locationY
      }
    };
  };

  var generateArrayObjects = function (num) {
    var array = [];

    for (var i = 1; i <= num; i++) {
      array.push(generateObject(i));
    }

    return array;
  };

  window.data = generateArrayObjects(NUMBER_OF_OBJECTS);

})();
