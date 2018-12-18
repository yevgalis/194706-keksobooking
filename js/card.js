'use strict';

(function () {

  var renderedMapCard;

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

  var closeCard = function () {
    if (renderedMapCard) {
      renderedMapCard.remove();
      window.pins.resetClickedPin();
    }
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

  var onDocumentKeydown = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      closeCard();
      document.body.removeEventListener('keydown', onDocumentKeydown);
    }
  };

  var renderMapCard = function (cardItem) {
    renderedMapCard = createMapCard(cardItem);
    window.map.appendChild(renderedMapCard);
    document.body.addEventListener('keydown', onDocumentKeydown);
  };

  window.card = {
    closeCard: closeCard,
    renderMapCard: renderMapCard
  };

})();
