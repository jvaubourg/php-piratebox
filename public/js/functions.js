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


/*****************/
/*** FUNCTIONS ***/
/*****************/

// Set events for files
// files: $('.file')
function setFileEvents(files) {
  files.click(clickFile);
  files.dblclick(dblClickFile);
  files.find('[data-toggle="tooltip"]').tooltip();
  files.find('.shortname').bind('contextmenu', rightClickName);
}

// Set events for folders
// folders: $('.folder')
function setFolderEvents(folders) {
  folders.click(clickFolder);
  folders.find('.shortname').bind('contextmenu', rightClickName);
}

function ajaxDataError(data) {
  if(data.match(/^ERR:/)) {
    alert(data.replace(/^ERR:/, ''));
    return false;
  }

  return true;
}

// Change the current directory
// newcdir: directory path
// updateHistory: add an entry in the browser history or not
function changeDirectory(newcdir, updateHistory = true) {
  $.ajax({
    url: '?/get',
    data: { dir: encodeURIComponent(newcdir), ajax: true },
    method: 'GET',

  }).fail(function(data) {
    alert('Changing directory failed.');

    $(window).prop('location', '/');

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

    var files = $('.file');
    var folders = $('.folder');

    setFileEvents(files);
    setFolderEvents(folders);

    $('.file').fadeIn();
    $('.folder').fadeIn();

    $('html,body').scrollTop($('#files').prev().offset().top);
  });
}

// Update the breadcrumbs navigation bar
// updateHistory: add an entry in the browser history or not
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

// Display the chat instead of the current directory
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

// Display the current directory instead of the chat
function switchToFiles() {
  history.pushState({}, '', '/');

  $('html,body').scrollTop(0);
  $('nav').removeClass('navbar-fixed-top');
  $('#main').addClass('container');
  $('#footer').show();
  $('#pseudoin').hide();
  $('#gotoupload').show();
}

// Update the chat log
// loop: permanent updating or not
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

// Update the number of new chat messages on the main menu
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

// Return true if the current displayed tab corresponds to tab
// tab: tab name (files or chat)
function isTabActive(tab) {
  return $('#tab' + tab).css('display') != 'none';
}


/****************/
/*** HANDLERS ***/
/****************/

// Uploading files
// filedrop.js handler
function upload(files) {
  files.each(function(file) {
    var cdir = decodeURIComponent($('#nav').attr('data-cdir'));

    file.event('sendXHR', function() {
      $('#bars').append('<div class="barwrap"><span>' + file.name + '</span><div class="progress"><div class="progress-bar progress-bar-success progress-bar-striped active"></div></div></div>');
      file.bar = $('#bars .progress').last().find('.progress-bar');
      file.bar.css('width', 0);
      $('html,body').scrollTop($(document).height());
    });

    file.event('progress', function(current, total) {
      var width = current / total * 100 + '%';
      file.bar.css('width', width);
    });

    file.event('error', function(e, xhr) {
      alert('Uploading failed.');

      file.bar.closest('.barwrap').hide();
    });

    file.event('done', function(xhr) {
      if(!ajaxDataError(xhr.responseText)) {
        file.bar.closest('.barwrap').hide();
        return;
      }

      $('#infiles').append(xhr.responseText);
      $('#nofile').hide();

      var newfiles = $('.newfile');

      setFileEvents(newfiles);

      newfiles.slideDown()
      newfiles.removeClass('newfile');

      setTimeout(function() {
        file.bar.closest('.barwrap').fadeOut();
      }, 2000);
    });

    file.sendTo('?/upload&cdir=' + encodeURIComponent(cdir));
  });

  uploadArea.event('iframeDone', function(xhr) {
    alert(xhr.responseText);
  });
}

// Going to the upload area at the end of the page and opening the file browser
// $('#gotoupload')
function goToUpload() {
  $('html,body').animate({ scrollTop: $(document).height() }, 1000);
  $('#dragndrop input[type=file]').click();
}

// Displaying an input field for setting the name of the folder to create
// $('#createfolderbtn')
function createFolderInput() {
  var input = $('#createfolderinput input');

  $(this).hide();
  input.val('');
  $(this).next().show();
  input.focus();
}

// Cancelling the folder creation when quitting the field
// $('#createfolderinput input')
function createFolderInputBlur() {
  $('#createfolderbtn').next().hide();
  $('#createfolderbtn').show();
}

// Cancelling the folder creation by pressing Escape and confirming with Enter
// $('#createfolder input')
function createFolderInputKeys(e) {
  // Enter
  if(e.keyCode == 13) {
    $(this).next().find('button').click();
  }

  // Escape
  if(e.keyCode == 27) {
    $('#createfolderinput').hide();
    $('#createfolderbtn').show();
  }
}

// Confirming the folder creation by clicking on the button
// $('#createfolder button')
function createFolderBtn() {
  var name = $('#createfolderinput').find('input').val();
  var cdir = decodeURIComponent($('#nav').attr('data-cdir'));

  $.ajax({
    url: '?/createfolder',
    data: { name: name, cdir: cdir },
    method: 'POST',

  }).fail(function(data) {
    $('#createfolderbtn').next().hide();
    $('#createfolderbtn').show();

    alert('Creating folder failed.');

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
}

// Turning back time thanks to the browser history
// on('popstate')
function browserHistory(e) {
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
}

// Switching to the chat of files tab depending on the main menu state
// $('#menu a')
function showCorrectTab() {
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
}

// Posting a new chat message
// $('#chatbtn')
function postChatMessage() {
  var comment = $('#commentin').val();
  var pseudo = $('#pseudoin').val();

  if(comment == '') {
    return;
  }

  if(pseudo == '') {
    pseudo = defaultChatPseudo;
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
}

// Posting chat message by pressing Enter
// $('#commentin')
function postChatMessageKey(e) {

  // Enter
  if(e.keyCode == 13) {
    $(this).next().find('button').click();
  }
}

// Changing the current directory thanks to the breadcrumbs links
// $('#nav a')
function clickNav() {
  var dir = decodeURIComponent($(this).attr('data-dir'));

  changeDirectory(dir);

  return false;
}

// Downloading a file by double-clicking on it
// $('.file')
function dblClickFile() {
  $(window).prop('location', $(this).find('a').attr('href'));
}

// Selecting a file by clicking on it
// $('.file')
function clickFile() {
  if($(this).hasClass('activefile')) {
    $('.itemfile').removeClass('activefile');

  } else {
    $('.itemfile').removeClass('activefile');
    $(this).addClass('activefile');
  }
}

// Going into a directory by clicking on it
// $('.folder')
function clickFolder() {
  $('.itemfile').removeClass('activefile');
  $(this).addClass('activefile');
  var dir = decodeURIComponent($(this).attr('data-dir'));

  setTimeout(function() {
    changeDirectory(dir);
  }, 100);
}

// Renaming a file or a directory by right-clicking on its name
// $('.itemfile .shortname')
function rightClickName() {
  var isFolder = $(this).parent().hasClass('folder');
  var file = $(this).parent();
  var shortname = $(this).text();
  var filename;

  if(isFolder) {
    filename = shortname;
  } else {
    filename = $(this).parent().find('.filename').text();
  }

  filename = $('<textarea />').text(filename).html();

  $(this).attr('data-value', encodeURIComponent($(this).text()));
  $(this).parent().removeClass('activefile');
  $(this).parent().off('click');

  $(this).empty();

  if(isFolder) {
    $(this).append('<input type="text" id="renamein" maxlength="16" />');

  } else {
    $(this).append('<input type="text" id="renamein" maxlength="100" />');
  }

  var input = $(this).children().first();

  input.val(filename);
  input.keypress(function(e) {

    // Enter
    if(e.keyCode == 13) {
      $(this).blur();
    }

    // Escape
    if(e.keyCode == 27) {
      $(this).val(filename);
      $(this).blur();
    }
  });
  input.focus();

  input.blur(function() {
    var oldName = filename;
    var newName = $(this).val();
    var cdir = decodeURIComponent($('#nav').attr('data-cdir'));

    if(oldName == newName) {
      if(isFolder) {
        $(this).closest('.folder').click(clickFolder);

      } else {
        $(this).closest('.file').click(clickFile);
      }

      $(this).parent().append(shortname);
      $(this).remove();

      return;
    }

    $.ajax({
      url: '?/rename',
      data: {
        action: 'post',
        cdir: cdir,
        oldName: oldName,
        newName: newName,
      },
      method: 'POST',

    }).fail(function(data) {
      alert('Renaming failed.');

      input.val(oldName);
      input.blur();

    }).done(function(data) {
      if(!ajaxDataError(data)) {
        input.val(oldName);
        input.blur();

        return;
      }

      file.after(data);
      file.remove();

      if(isFolder) {
        var newfolder = $('.newfolder');

        setFolderEvents(newfolder);

        newfolder.fadeIn();
        newfolder.removeClass('newfolder');

      } else {
        var newfile = $('.newfile');

        setFileEvents(newfile);

        newfile.fadeIn()
        newfile.removeClass('newfile');
      }
    });
  });

  return false;
}
