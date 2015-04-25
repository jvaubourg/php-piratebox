<?php

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

require_once('functions.php');

dispatch('/', function() {
  set('files', getFiles('/'));
  set('tab', 'files');
  set('locked', true);
  set('cdir', '/');

  header('Content-Type: text/html; charset=utf-8');

  return render('home.html.php');
});

dispatch('/get', function() {
  $dir = sanitizeDirpath(urldecode($_GET['dir']));
  $ajax = isset($_GET['ajax']) && $_GET['ajax'];

  if($ajax) {
    header('Content-Type: text/plain; charset=utf-8');
  } else {
    header('Content-Type: text/html; charset=utf-8');
  }

  if(empty($dir) || !is_dir(UPLOADS_PATH.$dir)) {
    if($ajax) {
      exit('ERR:'.T_("Invalid destination.".UPLOADS_PATH.$dir));

    } else {
      header('Location: '.ROOT_DIR);
      exit();
    }
  }

  if($ajax) {
    return getFiles($dir, true);
  }

  $perms = fileperms(UPLOADS_PATH.$dir);
  $locked = !($perms & 0x0080) || $dir == '/';

  set('files', getFiles($dir));
  set('tab', 'files');
  set('locked', $locked);
  set('cdir', $dir);

  return render('home.html.php');
});

dispatch_post('/rename', function() {
  $cdir = sanitizeDirpath($_POST['cdir']);
  $oldName = sanitizeFilename($_POST['oldName']);
  $newName = sanitizeFilename($_POST['newName']);

  $oldFilePath = UPLOADS_PATH."$cdir/$oldName";
  $newFilePath = UPLOADS_PATH."$cdir/$newName";

  header('Content-Type: text/plain; charset=utf-8');

  if(!option('allow_renaming')) {
    exit('ERR:'.T_("Unauthorized."));
  }

  if(empty($oldName) || empty($newName)) {
    exit('ERR:'.T_("Invalid filename."));
  }

  if(!file_exists($oldFilePath)) {
    exit('ERR:'.T_("File not found."));
  }

  if(file_exists($newFilePath)) {
    exit('ERR:'.T_("File already exists."));
  }

  if(!rename($oldFilePath, $newFilePath)) {
    exit('ERR:'.T_("Renaming failed."));
  }

  if(is_dir($newFilePath)) {
    $folder = array(
      'name' => $newName,
      'dir'  => "$cdir/$newName",
    );

    set('folder', $folder);
    set('locked', false);
    set('newfolder', true);

    echo partial('_folder.html.php');

  } else {
    $file = array(
      'filename'  => UPLOADS_DIR.str_replace('%2F', '/', rawurlencode($cdir)).'/'.rawurlencode($newName),
      'name'      => $newName,
      'shortname' => getShortname($newName),
      'img'       => getExtensionImage($newFilePath),
      'size'      => fileSizeConvert(filesize($newFilePath)),
      'date'      => dateConvert(filemtime($newFilePath)),
    );

    set('file', $file);
    set('locked', false);
    set('newfile', true);

    echo partial('_file.html.php');
  }
});

dispatch_post('/delete', function() {
  $cdir = sanitizeDirpath($_POST['cdir']);
  $name = sanitizeFilename($_POST['name']);

  $filePath = UPLOADS_PATH."$cdir/$name";

  header('Content-Type: text/plain; charset=utf-8');

  if(!option('allow_deleting')) {
    exit('ERR:'.T_("Unauthorized."));
  }

  if(!file_exists($filePath)) {
    exit('ERR:'.T_("File not found."));
  }

  if(is_dir($filePath)) {
    $files = scandir($filePath);

    if(!$files) {
      exit('ERR:'.T_("Cannot read this directory."));
    }

    if(count($files) > 2) {
      exit('ERR:'.T_("Not empty directory."));
    }

    if(!rmdir($filePath)) {
      exit('ERR:'.T_("Cannot delete this directory."));
    }

  } else {
    if(!unlink($filePath)) {
      exit('ERR:'.T_("Cannot delete this file."));
    }
  }
});

dispatch_post('/upload', function() {
  $cdir = sanitizeDirpath(urldecode($_GET['cdir']));
  $name = sanitizeFilename(urldecode(@$_SERVER['HTTP_X_FILE_NAME']));

  $dirpath = UPLOADS_PATH."$cdir";
  $filename = "$dirpath/$name";

  header('Content-Type: text/plain; charset=utf-8');

  if(empty($cdir) || !is_dir($dirpath)) {
    exit('ERR:'.T_("Invalid directory."));
  }

  if(empty($name)) {
    exit('ERR:'.T_("Invalid filename."));
  }

  if(file_exists($filename)) {
    exit('ERR:'.T_("File already exists."));
  }

  $src = fopen('php://input', 'r');
  $dst = fopen($filename, 'w');

  if(!$src || !$dst) {
    exit('ERR:'.T_("Uploading failed."));
  }

  stream_copy_to_stream($src, $dst);

  $file = array(
    'filename'  => UPLOADS_DIR.str_replace('%2F', '/', rawurlencode($cdir)).'/'.rawurlencode($name),
    'name'      => $name,
    'shortname' => getShortname($name),
    'img'       => getExtensionImage($filename),
    'size'      => fileSizeConvert(filesize($filename)),
    'date'      => dateConvert(filemtime($filename)),
  );

  set('file', $file);
  set('locked', false);
  set('newfile', true);

  echo partial('_file.html.php');
});

dispatch_post('/createfolder', function() {
  $name = sanitizeDirname($_POST['name']);
  $cdir = sanitizeDirpath($_POST['cdir']);

  $dirpath = UPLOADS_PATH."$cdir";
  $filename = "$dirpath/$name";

  header('Content-Type: text/plain; charset=utf-8');

  if(!option('allow_newfolders')) {
    exit('ERR:'.T_("Unauthorized."));
  }

  if(empty($cdir) || !is_dir($dirpath)) {
    exit('ERR:'.T_("Invalid directory."));
  }

  if(empty($name)) {
    exit('ERR:'.T_("Invalid directory name."));
  }

  if(file_exists($filename)) {
    exit('ERR:'.T_("File already exists."));
  }

  if(!mkdir(UPLOADS_PATH."$cdir/$name")) {
    exit('ERR:'.T_("Creating folder failed."));
  }

  $folder = array(
    'name' => $name,
    'dir'  => "$cdir/$name",
  );

  set('folder', $folder);
  set('locked', false);
  set('newfolder', true);

  echo partial('_folder.html.php');
});

dispatch('/chat', function() {
  header('Content-Type: text/html; charset=utf-8');

  if(!option('enable_chat')) {
    exit('ERR:'.T_("Unauthorized."));
  }

  set('files', getFiles('/'));
  set('tab', 'chat');
  set('locked', true);
  set('cdir', '/');

  return render('home.html.php');
});

dispatch_post('/chat', function() {
  $action = $_POST['action'];
  $logpath = CHAT_PATH.'log.html';

  header('Content-Type: text/plain; charset=utf-8');

  if(!option('enable_chat')) {
    exit('ERR:'.T_("Unauthorized."));
  }

  switch($action) {
    case 'getLog':
      if(file_exists($logpath)) {
        $count = intval($_POST['count']);

        $log = file($logpath);
        $logSize = count($log);

        if(!$log) {
          exit('ERR:'.T_("Failed to open chat log."));
        }

        if($count > $logSize) {
          exit('ERR:'.T_("Invalid count number."));
        }

        if(!empty($log) && $count != $logSize) {
          $logDiff = array();

          if($count < 1) {
            $logDiff = $log;
  
          } else {
            for($i = $count; $i < $logSize; $i++) {
              array_push($logDiff, $log[$i]);
            }
          }

          echo implode($logDiff);
        }
      }
    break;

    case 'post':
      $pseudo = substr(trim($_POST['pseudo']), 0, 12);
      $pseudo = htmlentities($pseudo);
      $comment = htmlentities(trim($_POST['comment']));
      $date = date('d/m/y H:i');

      if(empty($pseudo) || empty($comment)) {
        exit();
      }

      $comment = preg_replace('/([\w\d]+\:\/\/(?:[\w\-\d]+\.)+[\w\-\d]+(?:\/[\w\-\d]+)*(?:\/|\.[\w\-\d]+)?(?:\?[\w\-\d]+\=[\w\-\d]+\&?)?(?:\#[\w\-\d]*)?)/i', '<a href="$1">$1</a>', $comment);

      $line = "<p data-title='$date'><span>$pseudo</span> $comment</p>\n";
      $flog = fopen($logpath, 'a') or die("Can't open chat log.");

      fwrite($flog, $line);
      fclose($flog);
    break;

    case 'getLineCount':
      $count = intval(exec('wc -l '.escapeshellarg($logpath).' 2> /dev/null'));

      echo ($count >= 0) ? $count : 0;
    break;
  }
});
