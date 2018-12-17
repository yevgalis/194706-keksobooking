'use strict';

(function () {

  var INVALID_FORM_INPUT_STYLE = '2px solid #ff6547';
  var VALID_FORM_INPUT_STYLE = 'none';
  var MIN_PRICE_BUNGALO = 0;
  var MIN_PRICE_FLAT = 1000;
  var MIN_PRICE_HOUSE = 5000;
  var MIN_PRICE_PALACE = 10000;
  var titleInput = window.utils.forms.adForm.querySelector('#title');
  var priceInput = window.utils.forms.adForm.querySelector('#price');
  var typeInput = window.utils.forms.adForm.querySelector('#type');
  var timeinInput = window.utils.forms.adForm.querySelector('#timein');
  var timeoutInput = window.utils.forms.adForm.querySelector('#timeout');
  var roomInput = window.utils.forms.adForm.querySelector('#room_number');
  var capacityInput = window.utils.forms.adForm.querySelector('#capacity');
  var submitButton = window.utils.forms.adForm.querySelector('.ad-form__submit');


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
    if (window.utils.forms.adForm.checkValidity()) {
      window.utils.forms.adFormAddress.disabled = false;
    }
  };


  // DISABLE FORM INPUTS WHEN NOT ACTIVE
  window.utils.functions.manageFormInputs(window.utils.forms.adFormFieldsets, true);
  window.utils.functions.manageFormInputs(window.utils.forms.mapFiltersFormSelects, true);
  window.utils.forms.mapFiltersFormFieldset.disabled = true;

  // SET DEFUALT FORM INPUTS VALUES IF NEEDED
  window.utils.forms.adFormAddress.disabled = true;
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

})();
