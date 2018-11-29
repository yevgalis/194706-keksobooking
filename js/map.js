'use strict';

var APPARTMENT_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var appartmentTitlesCopy = APPARTMENT_TITLES.slice(); // To save the original array
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
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var MIN_LOCATION_X = 0;
var MAX_LOCATION_X = mapPins.clientWidth;
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;

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
  var locationX = getRandomNumber(MIN_LOCATION_X, MAX_LOCATION_X);
  var locationY = getRandomNumber(MIN_LOCATION_Y, MAX_LOCATION_Y);

  var advertisementItem = {
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

  return advertisementItem;
};

var generateArrayObjects = function (num) {
  var array = [];

  for (var i = 1; i <= num; i++) {
    array.push(generateObject(i));
  }

  return array;
};

// GENERATING ARRAY OF OBJECTS
var rentalAdvertisements = generateArrayObjects(NUMBER_OF_OBJECTS);

// CREATE MAP PINS
var generatePin = function (source, num) {
  var newPin = source.cloneNode(true);
  var newPinWidth = source.children[0].width;
  var newPinHeight = source.children[0].height;
  newPin.style.left = (rentalAdvertisements[num].location.x - newPinWidth / 2) + 'px';
  newPin.style.top = (rentalAdvertisements[num].location.y - newPinHeight) + 'px';
  newPin.children[0].src = rentalAdvertisements[num].author.avatar;
  newPin.children[0].alt = rentalAdvertisements[num].offer.title;

  return newPin;
};

var createMapPins = function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < rentalAdvertisements.length; i++) {
    fragment.appendChild(generatePin(pinTemplate, i));
  }

  return fragment;
};

// CREATE MAP CARDS
var translateAppartmentType = function (argument) {
  var resultType;

  switch (argument.toLowerCase()) {
    case 'flat':
      resultType = 'Квартира';
      break;
    case 'bungalo':
      resultType = 'Бунгало';
      break;
    case 'palace':
      resultType = 'Дворец';
      break;
    case 'house':
      resultType = 'Дом';
      break;
  }

  return resultType;
};

var createFeatureItems = function (arr) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    var featureItem = document.createElement('li');
    featureItem.classList.add('popup__feature');
    featureItem.classList.add('popup__feature--' + arr[i]);
    fragment.appendChild(featureItem);
  }

  return fragment;
};

var createPhotoItems = function (arr, source) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    var photoItem = source.cloneNode(true);
    photoItem.src = arr[i];
    fragment.appendChild(photoItem);
  }

  return fragment;
};

var createMapCard = function (index) {
  var cardElement = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);
  var cardTitle = cardElement.querySelector('.popup__title');
  var cardAddress = cardElement.querySelector('.popup__text--address');
  var cardPrice = cardElement.querySelector('.popup__text--price');
  var cardType = cardElement.querySelector('.popup__type');
  var cardCapacity = cardElement.querySelector('.popup__text--capacity');
  var cardCheckInOut = cardElement.querySelector('.popup__text--time');
  var cardFeatures = cardElement.querySelector('.popup__features');
  var cardDescription = cardElement.querySelector('.popup__description');
  var cardPhotosList = cardElement.querySelector('.popup__photos');
  var cardPhoto = cardElement.querySelector('.popup__photo');

  cardTitle.textContent = rentalAdvertisements[index].offer.title;
  cardAddress.textContent = rentalAdvertisements[index].offer.address;
  cardPrice.innerHTML = rentalAdvertisements[index].offer.price + '&#x20bd;<span>/ночь</span>';
  cardType.textContent = translateAppartmentType(rentalAdvertisements[index].offer.type);
  cardCapacity.textContent = rentalAdvertisements[index].offer.rooms + ' комнаты для ' + rentalAdvertisements[index].offer.guests + ' гостей';
  cardCheckInOut.textContent = 'Заезд после ' + rentalAdvertisements[index].offer.checkin + ', выезд до ' + rentalAdvertisements[index].offer.checkout;
  cardFeatures.innerHTML = '';
  cardFeatures.appendChild(createFeatureItems(rentalAdvertisements[index].offer.features));
  cardDescription.textContent = rentalAdvertisements[index].offer.description;
  cardPhotosList.innerHTML = '';
  cardPhotosList.appendChild(createPhotoItems(rentalAdvertisements[index].offer.photos, cardPhoto));

  return cardElement;
};

// RENDER ELEMENTS ON THE PAGE
var renderElement = function (parent, element) {
  parent.appendChild(element);
};

// ADDING ELEMENTS TO DOM
renderElement(mapPins, createMapPins());
renderElement(map, createMapCard(0));
