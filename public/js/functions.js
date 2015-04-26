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
}

// Set events for folders
// folders: $('.folder')
function setFolderEvents(folders) {
  folders.click(clickFolder);
}

// Show no file notice with the folder delete button (or not)
// fade (opt): use animations or not
function showNoFile(fade) {
  fade = (typeof fade === 'undefined') ? false : fade;

  if($('#tabfiles').data('optAllowDeleting') && $('#nav').data('cdir') != '%2F') {
    $('.folderdelete').unbind('click');

    if($('#nav').data('locked')) {
      $('.folderdelete').addClass('lockedaction');

    } else {
      $('.folderdelete').removeClass('lockedaction');
      $('.folderdelete').click(deleteFolderBtn);
    }

    $('.folderdelete').show();

  } else {
    $('.folderdelete').hide();
  }

  if(fade) {
    $('#nofile').fadeIn();

  } else {
    $('#nofile').show();
  }
}

// Hide the no file notice with the folder delete button
// fade (opt): use animations or not
function hideNoFile(fade) {
  fade = (typeof fade === 'undefined') ? false : fade;

  if(fade) {
    $('#nofile').fadeOut();

  } else {
    $('#nofile').hide();
  }
}

// Close the download panel
function closeDownload() {
  $('#download').hide();
  $('.itemfile').removeClass('activefile');
}

// Show ajax error if necessary and return false if there is one
// data: ajax data
function ajaxDataError(data) {
  if(data.match(/^ERR:/)) {
    alert(data.replace(/^ERR:/, ''));
    return false;
  }

  return true;
}

// Change the current directory
// newcdir: directory path
// updateHistory (opt): add an entry in the browser history or not
function changeDirectory(newcdir, updateHistory) {
  updateHistory = (typeof updateHistory === 'undefined') ? true : updateHistory;

  $.ajax({
    url: $('body').data('optBaseUri') + '?/get',
    data: { dir: encodeURIComponent(newcdir), ajax: true },
    method: 'GET',

  }).fail(function(data) {
    alert('Changing directory failed.');

    $(window).prop('location', $('body').data('optBaseUri'));

  }).done(function(data) {
    if(!ajaxDataError(data)) {
      $(window).prop('location', $('body').data('optBaseUri'));

      return;
    }

    var folderWithLocation = $('.folder[data-dir="' + encodeURIComponent(newcdir) + '"]');
    var locked = false;

    if(newcdir == '/') {
      locked = true;

    } else if(folderWithLocation.length > 0) {
      locked = folderWithLocation.data('locked');
    }

    $('#nav').data('cdir', encodeURIComponent(newcdir));
    $('#nav').data('locked', locked);

    $('#infiles').empty();
    $('#infiles').append(data);

    if($('#infiles').children().length == 0) {
      showNoFile();

    } else {
      hideNoFile();
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
  var cdir = decodeURIComponent(nav.data('cdir'));
  var title = $(document).prop('title').split(' - ')[0];

  cdir = cdir.replace(/^\/*/, '');
  cdir = cdir.replace(/\/*$/, '');

  if(cdir != '') {
    title += ' - ' + cdir;
  }

  $(document).prop('title', title);

  if(updateHistory) {
    var url = $('body').attr('optBaseUri');

    if($('nav').data('optFancyurls')) {
      url = encodeURIComponent(cdir).replace(/%2F/g, '/');
      url += (url == '') ? '' : '/';
      url = $('body').data('optBaseUri') + url;

    } else {
      url = $('body').data('optBaseUri') + '?/get&dir=' + encodeURIComponent(cdir);
    }

    history.pushState({}, '', url);
  }

  nav.empty();

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
function switchToChat(updateHistory) {
  updateHistory = (typeof updateHistory === 'undefined') ? true : updateHistory;

  var cdir = decodeURIComponent($('#nav').data('cdir'));
  var url;

  if(updateHistory) {
    if($('nav').data('optFancyurls')) {
      url = encodeURIComponent(cdir).replace(/%2F/g, '/').replace(/^\/+/, '');
      url += (url == '') ? '' : '/';
      url = $('body').data('optBaseUri') + url + '#chat';
  
    } else {
      url = $('body').data('optBaseUri') + '?/' + encodeURIComponent(cdir) + '#chat';
    }
  
    history.pushState({}, '', url);
  }

  updateChat();

  $('#main').removeClass('container');
  $('#footer').hide();
  $('#gotoupload').hide();
  $('#pseudoin').show();

  $('html,body').scrollTop($(document).height());
  $('#commentin').focus();
}

// Display the current directory instead of the chat
function switchToFiles(updateHistory) {
  updateHistory = (typeof updateHistory === 'undefined') ? true : updateHistory;

  if(updateHistory) {
    history.pushState({}, '', $(location).attr('href').replace(/#chat$/, ''));
  }

  $('html,body').scrollTop(0);
  $('#main').addClass('container');
  $('#footer').show();
  $('#pseudoin').hide();
  $('#gotoupload').show();
}

// Update the chat log
// loop (opt): permanent updating or not
function updateChat(loop) {
  loop = (typeof loop === 'undefined') ? false : loop;

  var chat = $('#chatlog');
  var count = chat.data('count');

  if(isTabActive('chat') || !loop) {
    $.ajax({
      url: $('body').data('optBaseUri') + '?/chat',
      data: { action: 'getLog', count: count },
      method: 'POST',
  
    }).done(function(data) {
      if(data != '' && count == chat.data('count')) {
        $('#nomsg').hide();

        chat.append(data);
        chat.data('count', chat.find('p').length);
    
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
      url: $('body').data('opt-base-uri') + '?/chat',
      data: { action: 'getLineCount' },
      method: 'POST',
  
    }).done(function(data) {
      var count = data - $('#chatlog').data('count');
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

// Return a string without html entities
function nohtmlentities(txt) {
  return $('<textarea />').text(txt).html();
}

// Return true if the current displayed tab corresponds to tab
// tab: tab name (files or chat)
function isTabActive(tab) {
  return $('#tab' + tab).css('display') != 'none';
}

// Change active tab
// tab: tab to show
function goToTab(tab, updateHistory) {
  updateHistory = (typeof updateHistory === 'undefined') ? true : updateHistory;

  $('#menu li').removeClass('active');
  $('#menu a[data-tab=' + tab +']').parent().addClass('active');

  $('.tab').hide();
  $('#tab' + tab).fadeIn();

  if(tab == 'chat') {
    switchToChat(updateHistory);

  } else if(tab == 'files') {
    switchToFiles(updateHistory);
  }

  if($('#menu').css('display') != 'none' && $('.navbar-toggle').css('display') != 'none') {
    $('.navbar-toggle').click();
  }
}

// Propose to rename a file or a directory
// file: $('.itemfile')
function renameFile(file) {
  var isFolder = file.hasClass('folder');
  var shortname = file.find('.shortname');
  var shortnameTxt = shortname.text();
  var filename;

  if(isFolder) {
    filename = shortnameTxt;
  } else {
    filename = file.data('name');
  }

  filename = nohtmlentities(filename);

  file.removeClass('activefile');
  file.unbind('click');

  closeDownload();
  shortname.empty();

  if(isFolder) {
    shortname.append('<input type="text" id="renamein" maxlength="16" />');

  } else {
    shortname.append('<input type="text" id="renamein" maxlength="100" />');
  }

  var input = shortname.children().first();

  input.val(filename);
  input.keydown(function(e) {

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
    var cdir = decodeURIComponent($('#nav').data('cdir'));

    if(oldName == newName) {
      if(isFolder) {
        $(this).closest('.folder').click(clickFolder);

      } else {
        $(this).closest('.file').click(clickFile);
      }

      $(this).parent().append(shortnameTxt);
      $(this).remove();

      return;
    }

    $.ajax({
      url: $('body').data('optBaseUri') + '?/rename',
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

// Propose to delete a file
// file: $('.itemfile') - or current folder is false
function deleteFile(file) {
  file = (typeof file === 'undefined') ? false : file;

  var cdir = decodeURIComponent($('#nav').data('cdir'));
  var isFile = (file != false);
  var filename, file;

  if(isFile) {
    if(!confirm($('#tabfiles').data('txtDelfile'))) {
      return;
    }

    filename = file.data('name');
    filename = nohtmlentities(filename);

    closeDownload();

  } else {
    if(!confirm($('#tabfiles').data('txtDelfolder'))) {
      return;
    }

    filename = '.';
  }

  $.ajax({
    url: $('body').data('optBaseUri') + '?/delete',
    data: {
      action: 'post',
      cdir: cdir,
      name: filename,
    },
    method: 'POST',

  }).fail(function(data) {
    alert('Deleting failed.');

  }).done(function(data) {
    if(!ajaxDataError(data)) {
      return;
    }

    if(isFile) {
      file.slideUp();

      setTimeout(function() {
        file.remove();

        if($('.itemfile').length == 0) {
          showNoFile(true);
        }
      }, 500);

    } else {
      $('#nav li').last().prev().find('a').click();
    }
  });
}

function isFileLocked() {
  return $(this).data('locked');
}

// Create context menus for files and folders
function createContextMenus() {
  var fileMenuItems = {
    'open':     { name: $('#tabfiles').data('txtOpen') },
    'download': { name: $('#tabfiles').data('txtDownload') },
  };

  var folderMenuItems = {
    'open': { name: $('#tabfiles').data('txtOpen') },
  };

  if($('#tabfiles').data('optAllowRenaming') || $('#tabfiles').data('optAllowDeleting')) {
    fileMenuItems['separator'] = '-----';
    folderMenuItems['separator'] = '-----';
  }

  if($('#tabfiles').data('optAllowRenaming')) {
    fileMenuItems['rename'] = { name: $('#tabfiles').data('txtRename'), disabled: isFileLocked };
    folderMenuItems['rename'] = { name: $('#tabfiles').data('txtRename'), disabled: isFileLocked };
  }

  if($('#tabfiles').data('optAllowDeleting')) {
    fileMenuItems['delete'] = { name: $('#tabfiles').data('txtDelete'), disabled: isFileLocked };
  }

  $('#files').contextMenu({
    selector: '.file',
    animation: { show: 'show', hide: 'hide', duration: 150 },
    callback: fileContextMenu,
    items: fileMenuItems,
  });

  $('#files').contextMenu({
    selector: '.folder',
    animation: { show: 'show', hide: 'hide', duration: 150 },
    callback: folderContextMenu,
    items: folderMenuItems,
  });
}


/****************/
/*** HANDLERS ***/
/****************/

// Uploading files
// filedrop.js handler
function upload(files) {
  files.each(function(file) {
    var cdir = decodeURIComponent($('#nav').data('cdir'));

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

      hideNoFile();
      $('#infiles').append(xhr.responseText);

      var newfiles = $('.newfile');

      setFileEvents(newfiles);

      newfiles.slideDown()
      newfiles.removeClass('newfile');

      setTimeout(function() {
        file.bar.closest('.barwrap').fadeOut();
      }, 2000);
    });

    file.sendTo($('body').data('optBaseUri') + '?/upload&cdir=' + encodeURIComponent(cdir));
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

// Closing the download panel by clicking a button
// $('#closedownload')
function closeDownloadBtn() {
  closeDownload();
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

    return false;
  }

  // Escape
  if(e.keyCode == 27) {
    $('#createfolderinput').hide();
    $('#createfolderbtn').show();

    return false;
  }
}

// Confirming the folder creation by clicking on the button
// $('#createfolder button')
function createFolderBtn() {
  var name = $('#createfolderinput').find('input').val();
  var cdir = decodeURIComponent($('#nav').data('cdir'));

  $.ajax({
    url: $('body').data('optBaseUri') + '?/createfolder',
    data: { name: name, cdir: cdir },
    method: 'POST',

  }).fail(function(data) {
    $('#createfolderbtn').next().hide();
    $('#createfolderbtn').show();

    alert('Creating folder failed.');

  }).done(function(data) {
    if(!ajaxDataError(data)) {
      $('#createfolderbtn').next().hide();
      $('#createfolderbtn').show();

      return;
    }

    $('#infiles').append(data);
    $('#createfolderbtn').next().hide();
    $('#createfolderbtn').show();

    var newfolder = $('.newfolder');

    setFolderEvents(newfolder);
    hideNoFile();

    newfolder.slideDown()
    newfolder.removeClass('newfolder');
  });
}

// Turning back time thanks to the browser history
// on('popstate')
function browserHistory(e) {
  var url = $(location).attr('href');
  var dir = '/';

  if(url.match(/#chat$/)) {
    goToTab('chat', false);
    
  } else {
    if($('nav').data('optFancyurls')) {
      url = url.replace(/https?:\/\/[^\/]+\//, '/');
      dir = url.replace($('body').data('optBaseUri'), '/');
      dir = decodeURIComponent(dir);

    } else {
      url = url.match(/dir=([^&]*)/);

      if(url != null && url.length > 1) {
        dir = decodeURIComponent(url[1]);
      }
    }

    goToTab('files', false);
    changeDirectory(dir, false);
  }
}

// Switching to the chat of files tab depending on the main menu state
// $('#menu a')
function goToTabClick() {
  var tab = $(this).data('tab');

  if(!$(this).parent().hasClass('active')) {
    goToTab(tab);
  }
}

// Focusing the comment input by pressing Enter
// $('#peudoin')
function pseudoInputKeys(e) {

  // Enter
  if(e.keyCode == 13) {
    $('#commentin').focus();

    return false;
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
    url: $('body').data('optBaseUri') + '?/chat',
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
    lastChatMsg = comment;
    $('#commentin').val('');
  });
}

// Posting chat message by pressing Enter
// $('#commentin')
function postChatMessageKey(e) {

  // Enter
  if(e.keyCode == 13) {
    $(this).next().find('button').click();

    return false;
  }

  // Up arrow
  if(e.keyCode == 38) {
    $('#commentin').val(lastChatMsg);

    return false;
  }

  // Down arrow
  if(e.keyCode == 40) {
    $('#commentin').val('');

    return false;
  }

}

// Changing the current directory thanks to the breadcrumbs links
// $('#nav a')
function clickNav() {
  var dir = decodeURIComponent($(this).data('dir'));

  changeDirectory(dir);

  return false;
}

// Downloading a file by double-clicking on it
// $('.file')
function dblClickFile() {
  $(window).prop('location', $('#download').find('a').attr('href'));
}

// Selecting a file by clicking on it
// $('.file')
function clickFile() {
  if($(this).hasClass('activefile')) {
    $('#download').hide();
    $('.itemfile').removeClass('activefile');

  } else {
    $('.itemfile').removeClass('activefile');
    $(this).addClass('activefile');

    if($('#tabfiles').data('optAllowRenaming')) {
      $('#download .filerename').unbind('click');

      if($(this).data('locked')) {
        $('#download .filerename').addClass('lockedaction');

      } else {
        $('#download .filerename').removeClass('lockedaction');
        $('#download .filerename').click(renameFileBtn);
      }
    }
  
    if($('#tabfiles').data('optAllowDeleting')) {
      $('#download .filedelete').unbind('click');

      if($(this).data('locked')) {
        $('#download .filedelete').addClass('lockedaction');

      } else {
        $('#download .filedelete').removeClass('lockedaction');
        $('#download .filedelete').click(deleteFileBtn);
      }
    }

    $('#download .filename').text($(this).data('name'));
    $('#download .downloadfile').attr('href', ($(this).data('filename')));
    $('#download .filesize').text($(this).data('size'));
    $('#download .filedate').text($(this).data('date'));
    $('#download').show();
  }
}

// Going into a directory by clicking on it
// $('.folder')
function clickFolder() {
  closeDownload();
  $(this).addClass('activefile');
  var dir = decodeURIComponent($(this).data('dir'));

  setTimeout(function() {
    changeDirectory(dir);
  }, 100);
}

// Showing a context menu by right-clicking on file items
// $('.file')
function fileContextMenu(key, options) {
  switch(key) {
    case 'open':
      $(this).click();
    break;

    case 'download':
      var loc = nohtmlentities($(this).data('filename'));
      $(window).prop('location', loc);
    break;

    case 'rename':
      renameFileCtxMenu($(this));
    break;

    case 'delete':
      deleteFile($(this));
    break;
  }
}

// Showing a context menu by right-clicking on folder items
// $('.folder')
function folderContextMenu(key, options) {
  switch(key) {
    case 'open':
      $(this).click();
    break;

    case 'rename':
      renameFileCtxMenu($(this));
    break;
  }
}

// Deleting a file by clicking a button
// $('.filedelete')
function deleteFileBtn() {
  deleteFile($('.activefile'));
}

// Deleting a folder by clicking a button
// $('.folderdelete')
function deleteFolderBtn() {
  deleteFile(false);
}

// Deleting a file by clicking a button
// $('.filedelete')
function deleteFileCtxMenu(file) {
  deleteFile(file);
}

// Renaming a file by clicking a button
// $('.filerename')
function renameFileBtn() {
  renameFile($('.activefile'));
}

// Renaming a file by clicking a button
// $('.filerename')
function renameFileCtxMenu(file) {
  renameFile(file);
}
