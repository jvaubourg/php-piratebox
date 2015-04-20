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


/****************/
/*** FUNCTION ***/
/****************/

function clickFile() {
  if($(this).hasClass('activefile')) {
    $('.itemfile').removeClass('activefile');

  } else {
    $('.itemfile').removeClass('activefile');
    $(this).addClass('activefile');
  }
}

function dblClickFile() {
  $(window).prop('location', $(this).find('a').attr('href'));
}

function clickFolder() {
  $('.itemfile').removeClass('activefile');
  $(this).addClass('activefile');
  var dir = decodeURIComponent($(this).attr('data-dir'));

  setTimeout(function() {
    changeDirectory(dir);
  }, 100);
}

function clickNav() {
  var dir = decodeURIComponent($(this).attr('data-dir'));

  changeDirectory(dir);

  return false;
}

function ajaxDataError(data) {
  if(data.match(/^ERR:/)) {
    alert(data.replace(/^ERR:/, ''));
    return false;
  }

  return true;
}

function changeDirectory(newcdir, updateHistory = true) {
  $.ajax({
    url: '?/get',
    data: { dir: encodeURIComponent(newcdir), ajax: true },
    method: 'GET',

  }).fail(function(data) {
    alert('Change directory failed.');

  }).done(function(data) {
    if(!ajaxDataError(data)) {
      return;
    }

    $('#nav').attr('data-cdir', encodeURIComponent(newcdir));
    $('#infiles').empty();
    $('#infiles').append(data);

    if($('#infiles').children().length == 0) {
      $('#nofile').show();
    } else {
      $('#nofile').hide();
    }

    updateNav(updateHistory);

    $('.file').click(clickFile);
    $('.file').dblclick(dblClickFile)
    $('.file').find('[data-toggle="tooltip"]').tooltip();
    $('.file').fadeIn();

    $('.folder').click(clickFolder);
    $('.folder').fadeIn();

    $('html,body').scrollTop($('#files').prev().offset().top);
  });
}

function updateNav(updateHistory) {
  var nav = $('#nav');
  var rootTxt = nav.children().first().text();
  var cdir = decodeURIComponent(nav.attr('data-cdir'));
  var title = $(document).prop('title').split(' - ')[0];

  cdir = cdir.replace(/^\/*/, '');
  nav.empty();

  var url = '/';

  if(cdir != '') {
    title += ' - ' + cdir;
    url =  '/?/get&dir=' + encodeURIComponent(cdir);
  }
  
  if(updateHistory) {
    history.pushState({}, '', url);
  }

  $(document).prop('title', title);

  if(cdir == '') {
    nav.append('<li class="active">' + rootTxt + '</li>');

  } else {
    cdir = cdir.split('/');

    nav.append('<li><a href="#" data-dir="%2F">' + rootTxt + '</a></li>');
    var dir = '/';

    for(var i = 0; i < cdir.length - 1; i++) {
      dir += '/' + cdir[i];
      nav.append('<li><a href="#" data-dir="' + encodeURIComponent(dir) + '">' + cdir[i]  + '</a></li>');
    }

    nav.find('a').click(clickNav);
    nav.append('<li class="active">' + cdir[cdir.length - 1]  + '</li>');
  }
}

function switchToChat() {
  history.pushState({}, '', '/?/chat');
  updateChat();

  $('nav').addClass('navbar-fixed-top');
  $('#main').removeClass('container');
  $('#footer').hide();
  $('#gotoupload').hide();
  $('#pseudoin').show();

  $('html,body').scrollTop($(document).height());
}

function switchToFiles() {
  history.pushState({}, '', '/');

  $('html,body').scrollTop(0);
  $('nav').removeClass('navbar-fixed-top');
  $('#main').addClass('container');
  $('#footer').show();
  $('#pseudoin').hide();
  $('#gotoupload').show();
}

function updateChat(loop = false) {
  var chat = $('#chatlog');
  var count = chat.attr('data-count');

  if(isTabActive('chat') || !loop) {
    $.ajax({
      url: '?/chat',
      data: { action: 'getLog', count: count },
      method: 'POST',
  
    }).done(function(data) {
      if(data != '' && count == chat.attr('data-count')) {
        $('#nomsg').hide();

        chat.append(data);
        chat.attr('data-count', chat.find('p').length);
    
        $('#chatlog p:even:not(.row)').addClass('row');
        $('#chatlog p').tooltip();
        $('#menu .badge').text('0');
  
        if(isTabActive('chat')) {
          $('html,body').scrollTop($(document).height());
        }
      }

      if(loop) {
        setTimeout(function() {
          updateChat(true);
        }, 2500);
      }
    });

  } else {
    setTimeout(function() {
      updateChat(true);
    }, 2500);
  }
}

function updateChatBadge() {
  if(!isTabActive('chat')) {
    $.ajax({
      url: '?/chat',
      data: { action: 'getLineCount' },
      method: 'POST',
  
    }).done(function(data) {
      var count = data - $('#chatlog').attr('data-count');
      $('#menu .badge').text(count);
  
      setTimeout(function() {
        updateChatBadge();
      }, 5000);
    });

  } else {
    setTimeout(function() {
      updateChatBadge();
    }, 5000);
  }
}

function isTabActive(tab) {
  return $('#tab' + tab).css('display') != 'none';
}


/**************/
/*** EVENTS ***/
/***************/

$(document).ready(function() {
  $('.btn-group').button();
  $('[data-toggle="tooltip"]').tooltip();

  var defaultPseudo = 'anonymous' + Math.floor(Math.random() * 100);
  var uploadOptions = { iframe: { url: '?/upload' }, multiple: true };
  var uploadArea = new FileDrop('dragndrop', uploadOptions);
  
  uploadArea.event('send', function(files) {
    files.each(function(file) {
      var cdir = decodeURIComponent($('#nav').attr('data-cdir'));

      file.event('sendXHR', function() {
        $('#bars').append('<div class="barwrap"><span>' + file.name + '</span><div class="progress"><div class="progress-bar progress-bar-success progress-bar-striped active"></div></div></div>');
        file.bar = $('#bars .progress').last().children().first();
        file.bar.css('width', 0);
        $('html,body').scrollTop($(document).height());
      });
  
      file.event('progress', function(current, total) {
        var width = current / total * 100 + '%';
        file.bar.css('width', width);
      });
  
      file.event('error', function(e, xhr) {
        alert('Upload failed.');
      });
  
      file.event('done', function(xhr) {
        if(!ajaxDataError(xhr.responseText)) {
          file.bar.parent().parent().hide();
          return;
        }

        $('#infiles').append(xhr.responseText);
        $('#nofile').hide();

        var newfiles = $('.newfile');
        newfiles.click(clickFile);
        newfiles.dblclick(dblClickFile)
        newfiles.slideDown()
        newfiles.find('[data-toggle="tooltip"]').tooltip();
        newfiles.removeClass('newfile');

        setTimeout(function() {
          file.bar.parent().parent().fadeOut();
        }, 2000);
      });
  
      file.sendTo('?/upload&cdir=' + encodeURIComponent(cdir));
    });
  
    uploadArea.event('iframeDone', function(xhr) {
      alert(xhr.responseText);
    });
  });

  $('.file').click(clickFile);

  $('.folder').click(clickFolder);

  updateNav();
  updateChat();
  updateChat(true);
  updateChatBadge();

  $('.file').dblclick(dblClickFile);

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

    // Enter
    if(e.keyCode == 13) {
      $(this).next().find('button').click();
    }

    // Escape
    if(e.keyCode == 27) {
      $(this).parent().parent().hide();
      $('#createfolderbtn').show();
    }
  });

  $('#createfolder button').click(function() {
    var name = $(this).parent().parent().find('input').val();
    var cdir = decodeURIComponent($('#nav').attr('data-cdir'));

    $.ajax({
      url: '?/createfolder',
      data: { name: name, cdir: cdir },
      method: 'POST',

    }).fail(function(data) {
      alert('Create folder failed.');

    }).done(function(data) {
      if(!ajaxDataError(data)) {
        return;
      }

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

  $('#menu a').click(function() {
    var tab = $(this).attr('data-tab');

    if(!$(this).parent().hasClass('active')) {
      $('#menu li').removeClass('active');
      $(this).parent().addClass('active');

      $('.tab').hide();
      $('#tab' + tab).show();

      if(tab == 'chat') {
        switchToChat();

      } else if(tab == 'files') {
        switchToFiles();
      }

      if($('#menu').css('display') != 'none' && $('.navbar-toggle').css('display') != 'none') {
        $('.navbar-toggle').click();
      }
    }
  });

  $('#chatbtn').click(function() {
    var comment = $('#commentin').val();
    var pseudo = $('#pseudoin').val();

    if(comment == '') {
      return;
    }

    if(pseudo == '') {
      pseudo = defaultPseudo;
    }

    $.ajax({
      url: '?/chat',
      data: {
        action: 'post',
        pseudo: pseudo,
        comment: comment,
      },
      method: 'POST',

    }).fail(function(data) {
      alert('Sending failed.');

    }).done(function(data) {
      if(!ajaxDataError(data)) {
        return;
      }

      updateChat();
      $('#commentin').val('');
    });
  });

  $('#commentin').keydown(function(e) {

    // Enter
    if(e.keyCode == 13) {
      $(this).next().find('button').click();
    }
  });

  if($(location).attr('href').match(/\?\/chat$/)) {
    $('a[data-tab=chat]').click();
  }
});


/*****************/
/*** SHORTCURS ***/
/*****************/

$(document).keydown(function(e) {

  // Enter
  if(e.keyCode == 13) {
    if(isTabActive('files') && $('.activefile').length == 1) {
      $(window).prop('location', $('.activefile').find('a').attr('href'));
    }
  }

  // Escape
  if(e.keyCode == 27) {
    if(isTabActive('files')) {
      $('.activefile').removeClass('activefile');
    }
  }

  // <- and ->
  if(e.keyCode == 37 || e.keyCode == 39) {
    var activefile;

    if(isTabActive('files')) {
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
  }
});
