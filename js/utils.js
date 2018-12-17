'use strict';

(function () {

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var adFormAddress = adForm.querySelector('#address');
  var mapFiltersForm = map.querySelector('.map__filters');
  var mapFiltersFormSelects = mapFiltersForm.querySelectorAll('.map__filter');
  var mapFiltersFormFieldset = mapFiltersForm.querySelector('.map__features');

  var renderElement = function (parent, element) {
    parent.appendChild(element);
  };

  var manageFormInputs = function (formElements, isDisabled) {
    for (var i = 0; i < formElements.length; i++) {
      formElements[i].disabled = isDisabled;
    }
  };

  window.utils = {
    constants: {
      MIN_LOCATION_Y: 130,
      MAX_LOCATION_Y: 630,
      MIN_LOCATION_X: 0,
      MAX_LOCATION_X: mapPins.clientWidth,
      ESC_KEYCODE: 27
    },
    mapData: {
      map: map,
      mapPins: mapPins
    },
    forms: {
      adForm: adForm,
      adFormFieldsets: adFormFieldsets,
      adFormAddress: adFormAddress,
      mapFiltersForm: mapFiltersForm,
      mapFiltersFormSelects: mapFiltersFormSelects,
      mapFiltersFormFieldset: mapFiltersFormFieldset
    },
    functions: {
      manageFormInputs: manageFormInputs,
      renderElement: renderElement
    }
  };

})();
