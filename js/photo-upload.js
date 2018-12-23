'use strict';

(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var avatarSelector = document.querySelector('.ad-form-header__input');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var photoSelector = document.querySelector('.ad-form__input');
  var photoPreviewBlock = document.querySelector('.ad-form__photo');

  var checkFileType = function (filename) {
    return FILE_TYPES.some(function (it) {
      return filename.endsWith(it);
    });
  };

  var createFileReader = function (img, file) {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      img.src = reader.result;
    });

    reader.readAsDataURL(file);
  };

  var onAvatarInputChange = function () {
    var file = avatarSelector.files[0];
    var fileName = file.name.toLowerCase();

    if (checkFileType(fileName)) {
      createFileReader(avatarPreview, file);
    }
  };

  var onPhotosInputChange = function () {
    var file = photoSelector.files[0];
    var fileName = file.name.toLowerCase();
    var previewPhotosQuantity = photoPreviewBlock.querySelectorAll('.ad-form__photo-img').length;

    if (previewPhotosQuantity >= 5) {
      return;
    }

    var createImageItem = function () {
      var imageItem = document.createElement('img');

      imageItem.alt = 'Фотография жилья';
      imageItem.width = 40;
      imageItem.height = 40;
      imageItem.classList.add('ad-form__photo-img');

      return imageItem;
    };

    if (checkFileType(fileName)) {
      var imageItem = createImageItem();

      createFileReader(imageItem, file);
      photoPreviewBlock.appendChild(imageItem);
    }
  };

  avatarSelector.addEventListener('change', onAvatarInputChange);
  photoSelector.addEventListener('change', onPhotosInputChange);
})();
