/* php-piratebox
 * Copyright (C) 2015 Julien Vaubourg <julien@vaubourg.com>
 * Contribute at https://github.com/jvaubourg/php-piratebox
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function clickFile() {
  if($(this).hasClass('activefile')) {
    $('.file').removeClass('activefile');

  } else {
    $('.file').removeClass('activefile');
    $(this).addClass('activefile');
  }
}

$(document).ready(function() {
  $('.btn-group').button();
  $('[data-toggle="tooltip"]').tooltip();

  var options = {iframe: {url: '?/upload'}, multiple: true}
  var zone = new FileDrop('dragndrop', options);
  
  zone.event('send', function (files) {
    files.each(function (file) {

      file.event('sendXHR', function () {
        $('#bars').append('<div class="barwrap"><span>' + file.name + '</span><div class="progress"><div class="progress-bar progress-bar-success progress-bar-striped active"></div></div></div>');
        file.bar = $('#bars .progress').last().children().first();
        file.bar.css('width', 0);
        $('html,body').animate({ scrollTop: $(document).height() }, 1000);
      });
  
      file.event('progress', function (current, total) {
        var width = current / total * 100 + '%';
        file.bar.css('width', width);
      });
  
      file.event('done', function (xhr) {
        $('#infiles').append(xhr.responseText);
        $('.file').click(clickFile);
        $('.file').slideDown();

        setTimeout(function() {
          file.bar.parent().parent().fadeOut();
        }, 2000);
      });
  
      file.sendTo('?/upload');
    });
  
    zone.event('iframeDone', function(xhr) {
      alert(xhr.responseText);
    });
  });

  $('.file').click(clickFile);

  $('#gotoupload').click(function() {
    $('html,body').animate({ scrollTop: $(document).height() }, 1000);
  });
});

$(document).keydown(function(e) {
  if(e.keyCode == 13) {
    if($('.activefile').length == 1) {
      $('.activefile').find('.downloadfile').click();
    }
  }

  if(e.keyCode == 27) {
    $('.activefile').removeClass('activefile');
  }

  if(e.keyCode == 37) {
    if($('.activefile').length == 1) {
      $('.activefile').prev().click();

    } else {
      $('.file').last().click();
    }
  }

  if(e.keyCode == 39) {
    if($('.activefile').length == 1) {
      $('.activefile').next().click();

    } else {
      $('.file').first().click();
    }
  }
});
