// Constructor
function StreetViewBar() {
  var images = this.images = $('input[type="hidden"]');
  var container = this.container = $('#streetViewBar');
  var formattedImages = this.formattedImages = [];

  this.each_image(images);
  this.setup_list(container);

  $('.streetVieBar ul').bxSlider({
    slideMargin: 5,
    adaptiveHeight: true,
    responsive: true,
    controls: true,
    minSlides: 1,
    maxSlides: 10,
    slideWidth: 200
  });
}

StreetViewBar.prototype.each_image = function (images) {
  var formattedImages = this.formattedImages;
  var methods = this;
  // Start at 1 because the default map is 0
  var idCounter = 1;

  $.each(images, function(index, value) {
    var value = $(value).attr('value');
    var queryString = methods.parse_url(value);
    var url = methods.format_url(queryString, '200x200');

    formattedImages.push({
      parsedUrl: url,
      originalUrl: value,
      qs: queryString,
      id: idCounter
      });

    idCounter ++;
  });
};

StreetViewBar.prototype.parse_url = function (url) {
  // y = FOV
  // h = heading
  // t = pitch

  if (!url) {
    return false;
  }


  var data = url.split('/');
  var queryString = {};
  var pano;

  // Get the coordinates and positioning data
  data.forEach(function(value, index) {
    if (/@/.test(value)) {
      data = value;
    } else if (/data=/.test(value)) {
      pano = value;
    }
  });

  data = data.split('@')[1];
  data = data.split(',');

  // Remove the non numeric codes
  data.forEach(function(value, index) {
    data[index] = value.split(/[a-zA-Z]/)[0]
  });

  pano = this.parse_pano(pano);

  queryString.location = data[0] + ',' + data[1];
  queryString.fov = data[3];
  queryString.heading = data[4];
  queryString.pitch = data[5];
  queryString.pano = pano;

  // For an unknown reason, street view add 90 degrees to the pitch
  queryString.pitch = queryString.pitch - 90;

  return queryString;
};

StreetViewBar.prototype.parse_pano = function (pano) {
  /* example string:
  !3m5!1e1!3m3!1sfPhZjlaq_sAAAAQYNw-Ypw!2e0!3e11!4m2!3m1!1s0x14a1bd1837f5acf3:0x5c97c042f5eb0df6

  Split on the "!<1-10><a-z>":
  !3m 5
  !1e 1
  !3m 3
  !1s fPhZjlaq_sAAAAQYNw-Ypw
  !2e 0
  !3e 11
  !4m 2
  !3m 1
  !1s 0x14a1bd1837f5acf3
  :0x5c97c042f5eb0df6
  */

  var parsed = pano.split(/!\d\D/g)
  return parsed[4];
};

StreetViewBar.prototype.format_url = function (url, size) {
  if (!size) {
    size = '400x400';
  }
  var href = 'https://maps.googleapis.com/maps/api/streetview?size=' + size;

  $.each(url, function(index, value) {
    if (value) {
      href += ('&' + index + '=' + value)
    }
  });

  return href;
};

StreetViewBar.prototype.setup_list = function (container) {
  var html = '<ul class="test bxslider">';
  var formattedImages = this.formattedImages;
  var self = this;

  formattedImages.forEach(function(value, index) {
    html += self.add_image(value);
  });

  html += '</ul>';
  container.append(html);
};

StreetViewBar.prototype.add_image = function (image) {
  var qs = JSON.stringify(image.qs);

  return '<li>' +
            '<img class="streetViewImg" src="' + image.parsedUrl +
              '" data-original-href="' + image.originalUrl +
              '" data-id="' + image.id +
              '" data-query-string=' + qs + '>' +
            '</img>' +
          '</li>';
};
