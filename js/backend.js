'use strict';

(function () {

  var URL_LOAD = 'https://cors-anywhere.herokuapp.com/https://js.dump.academy/keksobooking/data';
  var URL_SEND = 'https://js.dump.academy/keksobooking';
  var RESULT_CODE_OK = 200;
  var TIMEOUT_DURATION = 10000;

  var setXhrRequest = function (onLoad, onError, isGetMethod) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === RESULT_CODE_OK && isGetMethod) {
        onLoad(xhr.response);
      } else if (xhr.status !== RESULT_CODE_OK && isGetMethod) {
        onError('Ошибка загрузки данных');
      } else if (xhr.status === RESULT_CODE_OK && !isGetMethod) {
        onLoad();
      } else if (xhr.status !== RESULT_CODE_OK && !isGetMethod) {
        onError('Ошибка отправки данных');
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + Math.round(xhr.timeout / 1000) + ' сек');
      xhr.abort();
    });

    xhr.timeout = TIMEOUT_DURATION;

    return xhr;
  };

  var getData = function (onLoad, onError) {
    var xhr = setXhrRequest(onLoad, onError, true);

    xhr.open('GET', URL_LOAD);
    xhr.send();
  };

  var sendData = function (data, onLoad, onError) {
    var xhr = setXhrRequest(onLoad, onError, false);

    xhr.open('POST', URL_SEND);
    xhr.send(data);
  };

  window.backend = {
    getData: getData,
    sendData: sendData
  };

})();
