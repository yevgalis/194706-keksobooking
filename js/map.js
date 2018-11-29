'use strict';

var appartmentTitles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var appartmentTypes = ['palace', 'flat', 'house', 'bungalo'];
var checkInOutTimes = ['12:00', '13:00', '14:00'];
var appartmentFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var appartmentPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');

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

var appartmentTitlesCopy = appartmentTitles.slice(); // To save the original array

var generateArrayObjects = function (num) {
  var array = [];

  for (var i = 1; i <= num; i++) {
    var advertisementItem = {
      'author': {
        'avatar': 'img/avatars/user0' + i + '.png'
      },
      'offer': {
        'title': getAppartmentTitles(appartmentTitlesCopy),
        'address': '600, 350',
        'price': getRandomNumber(1000, 1000000),
        'type': getRandomArrayElement(appartmentTypes),
        'rooms': getRandomNumber(1, 5),
        'guests': getRandomNumber(0, 10),
        'checkin': getRandomArrayElement(checkInOutTimes),
        'checkout': getRandomArrayElement(checkInOutTimes),
        'features': getChangedArray(appartmentFeatures),
        'description': '',
        'photos': shuffleArray(appartmentPhotos)
      },
      'location': {
        'x': getRandomNumber(0, mapPins.clientWidth),
        'y': getRandomNumber(130, 630)
      }
    };

    array.push(advertisementItem);
  }

  return array;
};

// GENERATING ARRAY OF OBJECTS
var rentalAdvertisements = generateArrayObjects(8);

// CREATE MAP PINS
var createMapPin = function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinTemplateWidth = pinTemplate.children[0].width;
  var pinTemplateHeight = pinTemplate.children[0].height;
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < rentalAdvertisements.length; i++) {
    var newElement = pinTemplate.cloneNode(true);
    newElement.style.left = (rentalAdvertisements[i].location.x - pinTemplateWidth / 2) + 'px';
    newElement.style.top = (rentalAdvertisements[i].location.y - pinTemplateHeight) + 'px';
    newElement.children[0].src = rentalAdvertisements[i].author.avatar;
    newElement.children[0].alt = rentalAdvertisements[i].offer.title;
    fragment.appendChild(newElement);
  }

  return fragment;
};

// var createMapPin2 = function (num) {
//   var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
//   var pinTemplateWidth = pinTemplate.children[0].width;
//   var pinTemplateHeight = pinTemplate.children[0].height;
//   var newElement = pinTemplate.cloneNode(true);

//   newElement.style.left = (rentalAdvertisements[num].location.x - pinTemplateWidth / 2) + 'px';
//   newElement.style.top = (rentalAdvertisements[num].location.y - pinTemplateHeight) + 'px';
//   newElement.children[0].src = rentalAdvertisements[num].author.avatar;
//   newElement.children[0].alt = rentalAdvertisements[num].offer.title;

//   return newElement;
// };

// CREATE MAP CARDS
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
  var cardPhotosListLength = cardPhotosList.children.length;
  var cardPhoto = cardElement.querySelector('.popup__photo');

  cardTitle.textContent = rentalAdvertisements[index].offer.title;
  cardAddress.textContent = rentalAdvertisements[index].offer.address;
  cardPrice.textContent = ''; // чтобы не использовать innerHTML
  cardPrice.insertAdjacentHTML('afterbegin', rentalAdvertisements[index].offer.price + '&#x20bd;<span>/ночь</span>'); // чтобы не использовать innerHTML

  switch (rentalAdvertisements[index].offer.type.toLowerCase()) {
    case 'flat':
      cardType.textContent = 'Квартира';
      break;
    case 'bungalo':
      cardType.textContent = 'Бунгало';
      break;
    case 'palace':
      cardType.textContent = 'Дворец';
      break;
    case 'house':
      cardType.textContent = 'Дом';
      break;
  }

  cardCapacity.textContent = rentalAdvertisements[index].offer.rooms + ' комнаты для ' + rentalAdvertisements[index].offer.guests + ' гостей';
  cardCheckInOut.textContent = 'Заезд после ' + rentalAdvertisements[index].offer.checkin + ', выезд до ' + rentalAdvertisements[index].offer.checkout;

  // Clear features list
  while (cardFeatures.firstChild) {
    cardFeatures.removeChild(cardFeatures.firstChild);
  }

  // Create features list item
  for (var i = 0; i < rentalAdvertisements[index].offer.features.length; i++) {
    var newListItem = document.createElement('li');
    newListItem.classList.add('popup__feature');
    newListItem.classList.add('popup__feature--' + rentalAdvertisements[index].offer.features[i]);
    cardFeatures.appendChild(newListItem);
  }

  cardDescription.textContent = rentalAdvertisements[index].offer.description;

  // Add IMG to the photo list
  for (var j = 0; j < rentalAdvertisements[index].offer.photos.length - cardPhotosListLength; j++) {
    var newCardPhoto = cardPhoto.cloneNode(true);
    cardPhotosList.appendChild(newCardPhoto);
  }

  // Setting SRC for photos
  for (var k = 0; k < cardPhotosList.children.length; k++) {
    cardPhotosList.children[k].src = rentalAdvertisements[index].offer.photos[k];
  }

  return cardElement;
};

// RENDER ELEMENTS ON THE PAGE
var renderElement = function (parent, element) {
  parent.appendChild(element);
};

// ADDING ELEMENTS TO DOM
renderElement(mapPins, createMapPin());
renderElement(map, createMapCard(0));
