'use strict';

(function () {

  var ANY_VALUE = 'any';
  var LOW_LIMIT = 10000;
  var HIGH_LIMIT = 50000;
  var filtersForm = document.querySelector('.map__filters');
  var housingTypeFilter = document.querySelector('#housing-type');
  var housingPriceFilter = document.querySelector('#housing-price');
  var housingRoomsFilter = document.querySelector('#housing-rooms');
  var housingGuestsFilter = document.querySelector('#housing-guests');
  var featuresList = document.querySelectorAll('.map__checkbox');

  var removeMapPins = function () {
    var allPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    allPins.forEach(function (pin) {
      pin.remove();
    });
  };

  var getFilterValues = function () {
    var filterValues = {
      housingType: ANY_VALUE,
      housingPrice: ANY_VALUE,
      housingRooms: ANY_VALUE,
      housingGuests: ANY_VALUE,
      housingFeatures: []
    };

    filterValues.housingType = housingTypeFilter.value;
    filterValues.housingPrice = housingPriceFilter.value;
    filterValues.housingRooms = housingRoomsFilter.value;
    filterValues.housingGuests = housingGuestsFilter.value;

    featuresList.forEach(function (input) {
      if (input.checked) {
        filterValues.housingFeatures.push(input.value);
      }
    });

    return filterValues;
  };

  var filterData = function () {
    var dataCopy = window.utils.pins.slice();
    var filterValues = getFilterValues();

    var checkPrice = function (item) {
      var price = false;

      switch (filterValues.housingPrice) {
        case 'middle':
          price = item.offer.price >= LOW_LIMIT && item.offer.price < HIGH_LIMIT;
          break;
        case 'low':
          price = item.offer.price < LOW_LIMIT;
          break;
        case 'high':
          price = item.offer.price >= HIGH_LIMIT;
          break;
        case ANY_VALUE:
          price = true;
          break;
      }

      return price;
    };

    var filteredItems = dataCopy
      .filter(function (item) {
        return item.offer.type === filterValues.housingType || filterValues.housingType === ANY_VALUE;
      })
      .filter(function (item) {
        return checkPrice(item);
      })
      .filter(function (item) {
        return item.offer.rooms === parseInt(filterValues.housingRooms, 0) || filterValues.housingRooms === ANY_VALUE;
      })
      .filter(function (item) {
        return item.offer.guests <= parseInt(filterValues.housingGuests, 0) || filterValues.housingGuests === ANY_VALUE;
      })
      .filter(function (item) {
        return filterValues.housingFeatures.every(function (featureItem) {
          return item.offer.features.includes(featureItem);
        });
      });

    removeMapPins();
    window.card.close();
    window.pins.create(filteredItems);
  };

  var filterDataDebounce = function () {
    window.debounce(filterData);
  };

  filtersForm.addEventListener('input', filterDataDebounce);

})();
