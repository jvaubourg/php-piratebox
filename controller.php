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

$extensionsImages = [
  'sql' => 'sql.png',
  'zip' => 'zip.png',
  'rar' => 'rar.png',
  'tar.gz' => 'archive.png',
  '7z' => 'zip.png',
  'gzip' => 'gzip.png',
  'php' => 'php.png',
  'py' => 'py.png',
  'jsp' => 'html.png',
  'html' => 'html.png',
  'htm' => 'html.png',
  'css' => 'css.png',
  'java' => 'java.png',
  'cpp' => 'cpp.png',
  'c' => 'c.png',
  'h' => 'h.png',
  'hpp' => 'hpp.png',
  'js' => 'js.png',
  'rss' => 'rss.png',
  'rb' => 'rb.png',
  'vcard' => 'authors.png',
  'exe' => 'exe.png',
  'deb' => 'package.png',
  'psd' => 'psd.png',
  'nfo' => 'readme.png',
  'csv' => 'calc.png',
  'xls' => 'calc.png',
  'xlsx' => 'calc.png',
  'ppt' => 'pres.png',
  'pptx' => 'pres.png',
  'doc' => 'doc.png',
  'odf' => 'doc.png',
  'docx' => 'doc.png',
  'otf' => 'doc.png',
  'rtf' => 'rtf.png',
  'txt' => 'txt.png',
  'log' => 'log.png',
  'src' => 'source.png',
  'tex' => 'tex.png',
  'bin' => 'bin.png',
  'cd' => 'cd.png',
  'sh' => 'script.png',
  'bash' => 'script.png',
  'bat' => 'script.png',
  'vcal' => 'vcal.png',
  'ical' => 'vcal.png',
  'mp3' => 'playlist.png',
  'avi' => 'playlist.png',
  'mp4' => 'video.png',
  'webm' => 'video.png',
  'wmv' => 'video.png',
  'mkv' => 'video.png',
  'rpm' => 'rpm.png',
  'tiff' => 'tiff.png',
  'jpg' => 'jpg.png',
  'jpeg' => 'jpg.png',
  'png' => 'png.png',
  'gif' => 'gif.png',
  'bmp' => 'bmp.png',
  'ico' => 'ico.png',
  'eps' => 'draw.png',
  'ai' => 'eps.png',
  'pdf' => 'pdf.png',
  'xml' => 'xml.png',
  'fla' => 'makefile.png',
  'swf' => 'makefile.png',
];

function getName($filename) {
    $path = explode('/', $filename);

    return array_pop($path);
}

function getShortname($filename) {
  $name = getName($filename);
  $namecut = explode('.', $name);
  $shortname = array_shift($namecut);
  $extension = array_pop($namecut);

  $shortname = substr($shortname, 0, 17);
  $extension = substr($extension, -4);
  $shortname = ("$shortname.$extension" == $name) ? $name : "$shortname...$extension";

  return $shortname;
}

function getExtensionImage($filename) {
  $extension = explode('.', $filename);
  $extension = array_pop($extension);

  if(isset($GLOBALS['extensionsImages'][$extension])) {
    return $GLOBALS['extensionsImages'][$extension];
  }

  return 'unknown.png';
}

function fileSizeConvert($bytes) {
  $units = [
    0 => [
      'unit'  => 'TB',
      'value' => pow(1024, 4),
    ],
    1 => [
        'unit'  => 'GB',
        'value' => pow(1024, 3),
    ],
    2 => [
        'unit'  => 'MB',
        'value' => pow(1024, 2),
    ],
    3 => [
        'unit'  => 'KB',
        'value' => 1024,
    ],
    4 => [
      'unit'  => 'B',
      'value' => 1,
    ],
  ];

  $bytes = floatval($bytes);

  foreach($units as $unit) {
    if($bytes > $unit['value']) {
      $size = $bytes / $unit['value'];
      $size = strval(round($size, 2));
      $size .= $unit['unit'];

      break;
    }
  }

  return $size;
}

function dateConvert($timestamp) {
  return date('d/m/y H:i', $timestamp);
}

function getFiles($dir, $newfiles = false) {
  $files = "";
  $finfo = new finfo;

  set('cdir', $dir);

  foreach(glob(UPLOADS_PATH."$dir/*") as $filename) {
    if(is_dir($filename)) {
      $folder = array(
        'name' => getName($filename),
        'dir' => "$dir/".getName($filename),
      );
    
      set('newfolder', $newfiles);
      set('folder', $folder);

      $files .= partial('_folder.html.php');

    } else {
      $file = array(
        'filename'  => UPLOADS_DIR."$dir/".rawurlencode(getName($filename)),
        'name'      => getName($filename),
        'shortname' => getShortname($filename),
        'img'       => getExtensionImage($filename),
        'size'      => fileSizeConvert(filesize($filename)),
        'date'      => dateConvert(filemtime($filename)),
      );

      set('newfile', $newfiles);
      set('file', $file);

      $files .= partial('_file.html.php');
    }
  }

  return $files;
}

dispatch('/', function() {
  set('files', getFiles('/'));
  set('tab', 'files');
  set('cdir', '/');

  return render('home.html.php');
});

dispatch('/get', function() {
  $dir = $_GET['dir'];
  $ajax = isset($_GET['ajax']) && $_GET['ajax'];

  if($ajax) {
    return getFiles($dir, true);
  }

  set('files', getFiles($dir));
  set('tab', 'files');
  set('cdir', $dir);

  return render('home.html.php');
});

dispatch_post('/upload', function() {
  ob_start();
  $callback = &$_REQUEST['fd-callback'];

  $cdir = $_GET['cdir'];
  
  if(!empty($_FILES['fd-file']) && is_uploaded_file($_FILES['fd-file']['tmp_name'])) {
    $name = stripslashes($_FILES['fd-file']['name']);
    move_uploaded_file($name, UPLOADS_PATH."/$cdir");

  } else {
    $name = stripslashes(urldecode(@$_SERVER['HTTP_X_FILE_NAME']));

    $src = fopen('php://input', 'r');
    $dst = fopen(UPLOADS_PATH."/$cdir/$name", 'w');

    stream_copy_to_stream($src, $dst);
  }

  $filename = UPLOADS_PATH."/$cdir/$name";

  $file = array(
    'filename'  => UPLOADS_DIR.rawurlencode(getName($filename)),
    'name'      => getName($filename),
    'shortname' => getShortname($filename),
    'img'       => getExtensionImage($name),
    'size'      => fileSizeConvert(filesize($filename)),
    'date'      => dateConvert(filemtime($filename)),
  );

  set('file', $file);
  set('newfile', true);
  $output = partial('_file.html.php');

  if($callback) {
    header('Content-Type: text/html; charset=utf-8');
    $output = addcslashes($output, "\\\"\0..\x1F");
    echo '<!DOCTYPE html><html><head></head><body><script type="text/javascript">', "try{window.top.$callback(\"$output\")}catch(e){}</script></body></html>";

  } else {
    header('Content-Type: text/plain; charset=utf-8');
    echo $output;
  }
});

dispatch_post('/createfolder', function() {
  $name = stripslashes($_POST['name']);
  $cdir = stripslashes($_POST['cdir']);

  mkdir(UPLOADS_PATH."$cdir/$name");

  $folder = array(
    'name' => $name,
    'dir'  => "$cdir/$name",
  );

  set('folder', $folder);
  set('newfolder', true);
  $output = partial('_folder.html.php');

  header('Content-Type: text/plain; charset=utf-8');
  echo $output;
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
      $output = file_get_contents($logpath);
  
      header('Content-Type: text/plain; charset=utf-8');
      echo $output;
    break;

    case 'post':
      $pseudo = htmlentities($_POST['pseudo']);
      $comment = htmlentities($_POST['comment']);
      $date = date('d/m/y H:i');

      $line = "<p data-title='$date'><span>$pseudo</span> $comment</p>\n";

      $flog = fopen($logpath, 'a') or die("Can't open chat log.");
      fwrite($flog, $line);
      fclose($flog);
    break;

    case 'getLineCount':
      $count = intval(exec('wc -l '.escapeshellarg($logpath).' 2>/dev/null'));
      echo $count;
    break;
  }
});
