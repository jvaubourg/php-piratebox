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
  set('cdir', '/');

  return render('home.html.php');
});

dispatch('/get', function() {
  $dir = str_replace('..', '', urldecode($_GET['dir']));
  $ajax = isset($_GET['ajax']) && $_GET['ajax'];

  if(empty($dir) || !is_dir(UPLOADS_PATH.$dir)) {
    $dir = '/';
  }

  if($ajax) {
    return getFiles($dir, true);
  }

  set('files', getFiles($dir));
  set('tab', 'files');
  set('cdir', $dir);

  return render('home.html.php');
});

dispatch_post('/upload', function() {
  $cdir = str_replace('..', '', $_GET['cdir']);
  $dirpath = UPLOADS_PATH."$cdir";
  $name = preg_replace('/^\.+/', '', str_replace('/', '_', urldecode(@$_SERVER['HTTP_X_FILE_NAME'])));
  $name = substr($name, 0, 100);
  $filename = "$dirpath/$name";

  header('Content-Type: text/plain; charset=utf-8');

  if(empty($cdir) || !is_dir($dirpath)) {
    exit('ERR:'.T_("Invalid directory.".$dirpath));
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
    exit('ERR:'.T_("Upload failed."));
  }

  stream_copy_to_stream($src, $dst);

  $file = array(
    'filename'  => UPLOADS_DIR.str_replace('%2F', '/', rawurlencode($cdir)).'/'.rawurlencode($name),
    'name'      => getName($filename),
    'shortname' => getShortname($filename),
    'img'       => getExtensionImage($name),
    'size'      => fileSizeConvert(filesize($filename)),
    'date'      => dateConvert(filemtime($filename)),
  );

  set('file', $file);
  set('newfile', true);

  echo partial('_file.html.php');
});

dispatch_post('/createfolder', function() {
  $name = preg_replace('/^\.+/', '', str_replace('/', '', $_POST['name']));
  $name = substr($name, 0, 16);
  $cdir = str_replace('..', '', $_POST['cdir']);
  $dirpath = UPLOADS_PATH."$cdir";
  $filename = "$dirpath/$name";

  header('Content-Type: text/plain; charset=utf-8');

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
    exit('ERR:'.T_("Create folder failed."));
  }

  $folder = array(
    'name' => $name,
    'dir'  => "$cdir/$name",
  );

  set('folder', $folder);
  set('newfolder', true);

  echo partial('_folder.html.php');
});

dispatch('/chat', function() {
  set('files', getFiles('/'));
  set('tab', 'chat');
  set('cdir', '/');

  return render('home.html.php');
});

dispatch_post('/chat', function() {
  $action = $_POST['action'];
  $logpath = CHAT_PATH.'log.html';

  switch($action) {
    case 'getLog':
      header('Content-Type: text/plain; charset=utf-8');

      echo file_get_contents($logpath);
    break;

    case 'post':
      $pseudo = substr($pseudo, 0, 12);
      $pseudo = htmlentities($_POST['pseudo']);
      $comment = htmlentities($_POST['comment']);
      $date = date('d/m/y H:i');

      if(empty($pseudo) || empty($comment)) {
        exit();
      }

      $line = "<p data-title='$date'><span>$pseudo</span> $comment</p>\n";
      $flog = fopen($logpath, 'a') or die("Can't open chat log.");

      fwrite($flog, $line);
      fclose($flog);
    break;

    case 'getLineCount':
      echo intval(exec('wc -l '.escapeshellarg($logpath).' 2> /dev/null'));
    break;
  }
});
