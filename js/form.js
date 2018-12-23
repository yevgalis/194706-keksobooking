'use strict';

(function () {

  var INVALID_FORM_INPUT_STYLE = '2px solid #ff6547';
  var VALID_FORM_INPUT_STYLE = 'none';
  var MIN_PRICE_BUNGALO = 0;
  var MIN_PRICE_FLAT = 1000;
  var MIN_PRICE_HOUSE = 5000;
  var MIN_PRICE_PALACE = 10000;
  var DEFUALT_AVATAR = 'img/muffin-grey.svg';
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormAddress = adForm.querySelector('#address');
  var titleInput = adForm.querySelector('#title');
  var priceInput = adForm.querySelector('#price');
  var typeInput = adForm.querySelector('#type');
  var timeinInput = adForm.querySelector('#timein');
  var timeoutInput = adForm.querySelector('#timeout');
  var roomInput = adForm.querySelector('#room_number');
  var capacityInput = adForm.querySelector('#capacity');
  var submitButton = adForm.querySelector('.ad-form__submit');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapFiltersFormSelects = mapFiltersForm.querySelectorAll('.map__filter');
  var mapFiltersFormFieldset = mapFiltersForm.querySelector('.map__features');
  var successWindow = document.querySelector('#success').content.querySelector('.success');
  var errorWindow = document.querySelector('#error').content.querySelector('.error');

  var manageFormInputs = function (formElements, isDisabled) {
    formElements.forEach(function (element) {
      element.disabled = isDisabled;
    });
  };

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

  var toggleDocumentListeners = function () {
    var deleteMessageElement = function () {
      var successElement = document.querySelector('.success');
      var errorElement = document.querySelector('.error');

      if (successElement) {
        successElement.remove();
      }

      if (errorElement) {
        errorElement.remove();
      }

      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keydown', onDocumentKeydown);
    };

    var onDocumentClick = function () {
      deleteMessageElement();
    };

    var onDocumentKeydown = function (evt) {
      if (evt.keyCode === window.utils.ESC_KEYCODE) {
        deleteMessageElement();
      }
    };

    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onDocumentKeydown);
  };


  var showSuccess = function () {
    var success = successWindow.cloneNode(true);

    toggleDocumentListeners();
    document.body.appendChild(success);
    submitButton.disabled = false;
    onFormReset();
  };

  var onFormReset = function () {
    var allPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var avatarImage = document.querySelector('.ad-form-header__preview img');
    var housingPhotos = document.querySelectorAll('.ad-form__photo-img');

    adForm.reset();
    window.card.close();
    window.map.hide();
    window.map.setMainPinDefaultPosition();
    adForm.classList.add('ad-form--disabled');
    manageFormInputs(mapFiltersFormSelects, true);
    mapFiltersFormFieldset.disabled = true;
    manageFormInputs(adFormFieldsets, true);
    avatarImage.src = DEFUALT_AVATAR;

    allPins.forEach(function (pin) {
      pin.remove();
    });

    housingPhotos.forEach(function (pin) {
      pin.remove();
    });
  };

  var showError = function (message) {
    var err = errorWindow.cloneNode(true);
    var errMessage = err.querySelector('.error__message');
    var errButton = err.querySelector('.error__button');

    errButton.addEventListener('click', function () {
      err.remove();
    });

    toggleDocumentListeners();
    errMessage.textContent = message;
    document.body.appendChild(err);
    submitButton.disabled = false;
  };

  var onFormSubmit = function (evt) {
    if (adForm.checkValidity()) {
      evt.preventDefault();
      adFormAddress.disabled = false;
      submitButton.disabled = true;
      window.backend.sendData(new FormData(adForm), showSuccess, showError);
    }

  };

  var activateForms = function () {
    adForm.classList.remove('ad-form--disabled');
    manageFormInputs(mapFiltersFormSelects, false);
    mapFiltersFormFieldset.disabled = false;
    manageFormInputs(adFormFieldsets, false);
  };

  var setAdFormAddress = function (x, y) {
    adFormAddress.value = x + ', ' + y;
  };

  // DISABLE FORM INPUTS WHEN NOT ACTIVE
  manageFormInputs(adFormFieldsets, true);
  manageFormInputs(mapFiltersFormSelects, true);
  mapFiltersFormFieldset.disabled = true;

  // SET DEFUALT FORM INPUTS VALUES IF NEEDED
  adFormAddress.disabled = true;
  onFormEnableSetGuests();

  // ADD LISTENERS
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
  resetButton.addEventListener('click', onFormReset);

  window.form = {
    activateForms: activateForms,
    setMapAddress: setAdFormAddress,
    error: errorWindow
  };

})();
