'use strict';

(function () {

  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_SEND = 'https://js.dump.academy/keksobooking';
  var RESULT_CODE_OK = 200;
  var TIMEOUT_DURATION = 10000;

  var getData = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === RESULT_CODE_OK) {
        onLoad(xhr.response);
      } else {
        onError('Ошибка загрузки данных');
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

    xhr.open('GET', URL_LOAD);
    xhr.send();
  };

  var sendData = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === RESULT_CODE_OK) {
        onLoad();
      } else {
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

    xhr.open('POST', URL_SEND);
    xhr.send(data);
  };

  window.backend = {
    getData: getData,
    sendData: sendData
  };

})();
