'use strict';

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
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var INVALID_FORM_INPUT_STYLE = '2px solid #ff6547';
var VALID_FORM_INPUT_STYLE = 'none';
var MIN_PRICE_BUNGALO = 0;
var MIN_PRICE_FLAT = 1000;
var MIN_PRICE_HOUSE = 5000;
var MIN_PRICE_PALACE = 10000;
var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var MIN_LOCATION_X = 0;
var MAX_LOCATION_X = mapPins.clientWidth;
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;
var ESC_KEYCODE = 27;
var appartmentTitlesCopy = APPARTMENT_TITLES.slice(); // To save original array
var mainMapPin = mapPins.querySelector('.map__pin--main');
var mapFiltersForm = map.querySelector('.map__filters');
var mapFiltersFormSelects = mapFiltersForm.querySelectorAll('.map__filter');
var mapFiltersFormFieldset = mapFiltersForm.querySelector('.map__features');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var adFormAddress = adForm.querySelector('#address');
var mapPinsPosition = mapPins.getBoundingClientRect();
var mainMapPinPosition = mainMapPin.getBoundingClientRect();
var renderedMapCard;
var clickedPin;
var MAIN_MAP_PIN_X = Math.floor((mainMapPinPosition.left - mapPinsPosition.left) + mainMapPin.clientWidth / 2);
var MAIN_MAP_PIN_Y = Math.floor((mainMapPinPosition.top - mapPinsPosition.top) + mainMapPin.clientHeight / 2);
var titleInput = adForm.querySelector('#title');
var priceInput = adForm.querySelector('#price');
var typeInput = adForm.querySelector('#type');
var timeinInput = adForm.querySelector('#timein');
var timeoutInput = adForm.querySelector('#timeout');
var roomInput = adForm.querySelector('#room_number');
var capacityInput = adForm.querySelector('#capacity');
var submitButton = adForm.querySelector('.ad-form__submit');

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

var rentalAdvertisements = generateArrayObjects(NUMBER_OF_OBJECTS);

// WORKING WITH THE MAP
var setMainPinAddress = function () {
  adFormAddress.value = MAIN_MAP_PIN_X + ', ' + MAIN_MAP_PIN_Y;
};

var manageFormInputs = function (formElements, isDisabled) {
  for (var i = 0; i < formElements.length; i++) {
    formElements[i].disabled = isDisabled;
  }
};

var closeCard = function () {
  if (renderedMapCard) {
    renderedMapCard.remove();
  }
};

var renderElement = function (parent, element) {
  parent.appendChild(element);
};

var onMainPinDrag = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  manageFormInputs(mapFiltersFormSelects, false);
  mapFiltersFormFieldset.disabled = false;
  manageFormInputs(adFormFieldsets, false);
  renderElement(mapPins, createMapPins());
  setMainPinAddress();
  mainMapPin.removeEventListener('mouseup', onMainPinDrag);
};

// CREATE MAP PINS
var generatePin = function (pinTemplate, advertisementItem) {
  var newPin = pinTemplate.cloneNode(true);
  var newPinImg = newPin.querySelector('img');
  newPin.style.left = (advertisementItem.location.x - PIN_WIDTH / 2) + 'px';
  newPin.style.top = (advertisementItem.location.y - PIN_HEIGHT) + 'px';
  newPinImg.src = advertisementItem.author.avatar;
  newPinImg.alt = advertisementItem.offer.title;

  newPin.addEventListener('click', function () {
    if (!clickedPin || clickedPin !== newPin) {
      closeCard();
      renderMapCard(advertisementItem);
      clickedPin = newPin;
    }
  });

  return newPin;
};


var onDocumentKeydown = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeCard();
    document.body.removeEventListener('keydown', onDocumentKeydown);
    clickedPin = null;
  }
};

var createMapPins = function () {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < rentalAdvertisements.length; i++) {
    fragment.appendChild(generatePin(pinTemplate, rentalAdvertisements[i]));
  }

  return fragment;
};

// CREATE MAP CARDS
var translateAppartmentType = function (appartmentType) {
  var resultType;

  switch (appartmentType.toLowerCase()) {
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

var createFeatureItems = function (features) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < features.length; i++) {
    var featureItem = document.createElement('li');
    featureItem.classList.add('popup__feature', 'popup__feature--' + features[i]);
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

var createMapCard = function (cardItem) {
  var cardElement = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);
  var cardAvatar = cardElement.querySelector('.popup__avatar');
  var cardClose = cardElement.querySelector('.popup__close');
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

  cardAvatar.src = cardItem.author.avatar;
  cardTitle.textContent = cardItem.offer.title;
  cardAddress.textContent = cardItem.offer.address;
  cardPrice.innerHTML = cardItem.offer.price + '&#x20bd;<span>/ночь</span>';
  cardType.textContent = translateAppartmentType(cardItem.offer.type);
  cardCapacity.textContent = cardItem.offer.rooms + ' комнаты для ' + cardItem.offer.guests + ' гостей';
  cardCheckInOut.textContent = 'Заезд после ' + cardItem.offer.checkin + ', выезд до ' + cardItem.offer.checkout;
  cardFeatures.innerHTML = '';
  cardFeatures.appendChild(createFeatureItems(cardItem.offer.features));
  cardDescription.textContent = cardItem.offer.description;
  cardPhotosList.innerHTML = '';
  cardPhotosList.appendChild(createPhotoItems(cardItem.offer.photos, cardPhoto));
  cardClose.addEventListener('click', closeCard);

  return cardElement;
};

var renderMapCard = function (cardItem) {
  renderedMapCard = createMapCard(cardItem);
  renderElement(map, renderedMapCard);
  document.body.addEventListener('keydown', onDocumentKeydown);
};

// FORM VALIDATION
var onFormInputValidation = function (evt) {
  var target = evt.target;
  var errorMessage;
  var formStyle;

  if (target.validity.tooShort) {
    errorMessage = 'Необходимо ввести не менее ' + target.minLength + ' символов.';
    formStyle = INVALID_FORM_INPUT_STYLE;
  } else if (target.validity.rangeUnderflow) {
    errorMessage = 'Значение должно быть не меньше ' + target.min;
    formStyle = INVALID_FORM_INPUT_STYLE;
  } else if (target.validity.rangeOverflow) {
    errorMessage = 'Значение должно быть равно или меньше ' + target.max;
    formStyle = INVALID_FORM_INPUT_STYLE;
  } else {
    errorMessage = '';
    formStyle = VALID_FORM_INPUT_STYLE;
  }

  target.setCustomValidity(errorMessage);
  target.style.border = formStyle;
};

var onFormInputCheckInput = function (evt) {
  var target = evt.target;
  var errorMessage;

  if (target.validity.tooShort) {
    errorMessage = 'Необходимо ввести не менее ' + target.minLength + ' символов. Введите еще минимум ' + (target.minLength - target.value.length);
  } else if (target.validity.rangeUnderflow) {
    errorMessage = 'Значение должно быть не меньше ' + target.min;
  } else if (target.validity.rangeOverflow) {
    errorMessage = 'Значение должно быть равно или меньше ' + target.max;
  } else {
    errorMessage = '';
    target.style.border = VALID_FORM_INPUT_STYLE;
  }

  target.setCustomValidity(errorMessage);
};

var onFormSelectTypeSet = function (evt) {
  var target = evt.target;
  var minPrice;
  var pricePlaceholder;

  switch (target.value) {
    case 'bungalo':
      minPrice = MIN_PRICE_BUNGALO;
      pricePlaceholder = MIN_PRICE_BUNGALO;
      break;
    case 'flat':
      minPrice = MIN_PRICE_FLAT;
      pricePlaceholder = MIN_PRICE_FLAT;
      break;
    case 'house':
      minPrice = MIN_PRICE_HOUSE;
      pricePlaceholder = MIN_PRICE_HOUSE;
      break;
    case 'palace':
      minPrice = MIN_PRICE_PALACE;
      pricePlaceholder = MIN_PRICE_PALACE;
      break;
  }

  priceInput.min = minPrice;
  priceInput.placeholder = pricePlaceholder;
};

var onFormSelectTimeSet = function (suncSelect, targetSelect) {
  suncSelect.value = targetSelect.value;
};

var onFormEnableSetGuests = function () {
  if (roomInput.value !== '100') {
    capacityInput.value = roomInput.value;
  } else {
    capacityInput.value = 0;
  }

  for (var i = 0; i < capacityInput.length; i++) {
    if ((roomInput.value !== '100' && (capacityInput[i].value > roomInput.value || capacityInput[i].value === '0')) || (roomInput.value === '100' && capacityInput[i].value !== '0')) {
      capacityInput[i].disabled = true;
    }
  }
};

var onFormSelectRoomSet = function (evt) {
  var target = evt.target;
  var disabledOptions = [];
  var enabledOptions = [];

  for (var i = 0; i < capacityInput.length; i++) {
    if ((target.value !== '100' && (capacityInput[i].value > target.value || capacityInput[i].value === '0')) || (target.value === '100' && capacityInput[i].value !== '0')) {
      capacityInput[i].disabled = true;
      disabledOptions.push(capacityInput[i].value);
    } else {
      capacityInput[i].disabled = false;
      enabledOptions.push(capacityInput[i].value);
    }
  }

  if (disabledOptions.includes(capacityInput.value)) {
    capacityInput.value = enabledOptions[0];
  }
};

var onFormSubmit = function () {
  if (adForm.checkValidity()) {
    adFormAddress.disabled = false;
  }
};

// DISABLE FORM INPUTS WHEN NOT ACTIVE
manageFormInputs(mapFiltersFormSelects, true);
mapFiltersFormFieldset.disabled = true;
manageFormInputs(adFormFieldsets, true);

// SET DEFUALT FORM INPUTS VALUES IF NEEDED
adFormAddress.disabled = true;
onFormEnableSetGuests();

// ADD LISTENERS
mainMapPin.addEventListener('mouseup', onMainPinDrag);
titleInput.addEventListener('invalid', onFormInputValidation);
titleInput.addEventListener('input', onFormInputCheckInput);
priceInput.addEventListener('invalid', onFormInputValidation);
priceInput.addEventListener('input', onFormInputCheckInput);
typeInput.addEventListener('input', onFormSelectTypeSet);
timeinInput.addEventListener('input', function () {
  onFormSelectTimeSet(timeoutInput, timeinInput);
});
timeoutInput.addEventListener('input', function () {
  onFormSelectTimeSet(timeinInput, timeoutInput);
});
roomInput.addEventListener('input', onFormSelectRoomSet);
submitButton.addEventListener('click', onFormSubmit);
