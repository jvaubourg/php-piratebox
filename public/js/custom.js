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
    $('.itemfile').removeClass('activefile');

  } else {
    $('.itemfile').removeClass('activefile');
    $(this).addClass('activefile');
  }
}

function clickFolder() {
  $('.itemfile').removeClass('activefile');
  $(this).addClass('activefile');
  var dir = $(this).attr('data-dir');

  setTimeout(function() {
    changeDirectory(dir);
  }, 100);
}

function clickNav() {
  var dir = $(this).attr('data-dir');

  changeDirectory(dir);

  return false;
}

function changeDirectory(newcdir, updateHistory = true) {
  $.ajax({
    url: '?/get',
    data: { dir: newcdir, ajax: true },
    method: 'GET',

  }).done(function(data) {
    $('#nav').attr('data-cdir', newcdir);
    $('#infiles').empty();
    $('#infiles').append(data);

    updateNav(updateHistory);

    $('.file').click(clickFile).fadeIn();
    $('.folder').click(clickFolder).fadeIn();
    $('html,body').scrollTop($('#files').prev().offset().top);
  });
}

function updateNav(updateHistory) {
  var nav = $('#nav');
  var rootTxt = nav.children().first().text();
  var cdir = nav.attr('data-cdir');
  var title = $(document).prop('title').split(' - ')[0];

  cdir = cdir.replace(/^\/*/, '');
  nav.empty();

  var url = '/';

  if(cdir != '') {
    title += ' - ' + cdir;
    url =  '/?/get&dir=' + cdir;
  }
  
  if(updateHistory) {
    history.pushState({}, '', url);
  }

  $(document).prop('title', title);

  if(cdir == '') {
    nav.append('<li class="active">' + rootTxt + '</li>');

  } else {
    cdir = cdir.split('/');

    nav.append('<li><a href="#" data-dir="/">' + rootTxt + '</a></li>');
    var dir = '/';

    for(var i = 0; i < cdir.length - 1; i++) {
      dir += '/' + cdir[i];
      nav.append('<li><a href="#" data-dir="' + dir + '">' + cdir[i]  + '</a></li>');
    }

    nav.find('a').click(clickNav);
    nav.append('<li class="active">' + cdir[cdir.length - 1]  + '</li>');
  }
}

$(document).ready(function() {
  $('.btn-group').button();
  $('[data-toggle="tooltip"]').tooltip();

  var options = { iframe: {url: '?/upload'}, multiple: true };
  var zone = new FileDrop('dragndrop', options);
  
  zone.event('send', function (files) {
    files.each(function (file) {
      var cdir = $('#nav').attr('data-cdir');

      file.event('sendXHR', function () {
        $('#bars').append('<div class="barwrap"><span>' + file.name + '</span><div class="progress"><div class="progress-bar progress-bar-success progress-bar-striped active"></div></div></div>');
        file.bar = $('#bars .progress').last().children().first();
        file.bar.css('width', 0);
        $('html,body').scrollTop($(document).height());
      });
  
      file.event('progress', function (current, total) {
        var width = current / total * 100 + '%';
        file.bar.css('width', width);
      });
  
      file.event('done', function (xhr) {
        $('#infiles').append(xhr.responseText);

        var newfiles = $('.newfile');
        newfiles.click(clickFile);
        newfiles.slideDown()
        newfiles.removeClass('newfile');

        setTimeout(function() {
          file.bar.parent().parent().fadeOut();
        }, 2000);
      });
  
      file.sendTo('?/upload&cdir=' + cdir);
    });
  
    zone.event('iframeDone', function(xhr) {
      alert(xhr.responseText);
    });
  });

  $('.file').click(clickFile);

  $('.folder').click(clickFolder);

  updateNav();

  $('.file').dblclick(function() {
    $(window).prop('location', $(this).find('a').attr('href'));
  }),

  $('#gotoupload').click(function() {
    $('html,body').animate({ scrollTop: $(document).height() }, 1000);
    $('#dragndrop input[type=file]').click();
  });

  $('#createfolderbtn').click(function() {
    var input = $(this).next().find('input');

    $(this).hide();
    input.val('');
    $(this).next().show();
    input.focus();
  });

  $('#createfolder input').keypress(function(e) {
    if(e.keyCode == 13) {
      $(this).next().find('button').click();
    }

    if(e.keyCode == 27) {
      $(this).parent().parent().hide();
      $('#createfolderbtn').show();
    }
  });

  $('#createfolder button').click(function() {
    var name = $(this).parent().parent().find('input').val();
    var cdir = $('#nav').attr('data-cdir');

    $.ajax({
      url: '?/createfolder',
      data: { name: name, cdir: cdir },
      method: 'POST',

    }).done(function(data) {
      $('#infiles').append(data);
      $('#createfolderbtn').next().hide();
      $('#createfolderbtn').show();

      var newfolder = $('.newfolder');
      newfolder.click(clickFolder);
      newfolder.slideDown()
      newfolder.removeClass('newfolder');
    });
  });

  $(window).on('popstate', function(e) {
    if(e.originalEvent.state !== null) {
      var url = $(location).attr('href');
      url = url.match(/dir=([^&]*)/);

      if(url != null && url.length > 1) {
        var dir = url[1];
        changeDirectory(dir, false);

      } else {
        changeDirectory('/', false);
      }
    }
  });
});

$(document).keydown(function(e) {
  if(e.keyCode == 13) {
    if($('.activefile').length == 1) {
      $(window).prop('location', $('.activefile').find('a').attr('href'));
    }
  }

  if(e.keyCode == 27) {
    $('.activefile').removeClass('activefile');
  }

  if(e.keyCode == 37 || e.keyCode == 39) {
    var activefile;

    if($('.activefile').length == 1) {
      if(e.keyCode == 37) {
        activefile = $('.activefile').prev();
      } else {
        activefile = $('.activefile').next();
      }

      $('.itemfile').removeClass('activefile');

    } else {
      if(e.keyCode == 37) {
        activefile = $('.file').last();
      } else {
        activefile = $('.file').first();
      }
    }

    $('html,body').scrollTop(activefile.offset().top - 180);
    activefile.addClass('activefile');
  }
});
