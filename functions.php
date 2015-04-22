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
  'gz' => 'archive.png',
  'tgz' => 'archive.png',
  '7z' => 'zip.png',
  'gzip' => 'gzip.png',
  'php' => 'php.png',
  'py' => 'py.png',
  'jsp' => 'html.png',
  'html' => 'html.png',
  'htm' => 'html.png',
  'css' => 'css.png',
  'java' => 'java.png',
  'jar' => 'java.png',
  'cpp' => 'cpp.png',
  'cc' => 'cpp.png',
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
  'svg' => 'svg.png',
];

function sanitizeFilename($name) {
  $name = str_replace('/', '', $name);
  $name = preg_replace('/^\.+/', '', $name);
  $name = substr($name, 0, 100);

  return $name;
}

function sanitizeDirpath($path) {
  $path = str_replace('..', '', $path);
  $path = trim($path);

  return $path;
}

function sanitizeDirname($name) {
  $name = sanitizeFilename($name);
  $name = substr($name, 0, 16);

  return $name;
}

function getShortname($name) {
  if(strpos($name, '.') === false) {
    $extension = '';
    $shortname = $name;

  } else {
    $namecut = explode('.', $name);
    $extension = array_pop($namecut);
    $shortname = implode('.', $namecut);
  }

  $shortname = substr($shortname, 0, 17);
  $extension = substr($extension, -4);

  if(empty($extension)) {
    $shortname = ($shortname == $name) ? $name : "$shortname...";
  } else {
    $shortname = ("$shortname.$extension" == $name) ? $name : "$shortname...$extension";
  }

  return $shortname;
}

function getExtensionImage($filepath) {
  $extension = explode('.', $filepath);
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

  foreach(scandir(UPLOADS_PATH."$dir") as $name) {
    $filepath = UPLOADS_PATH."$dir/$name";

    if(preg_match('/^\./', $name)) {
      continue;
    }

    if(is_dir($filepath)) {
      $folder = array(
        'name' => $name,
        'dir' => "$dir/$name",
      );
    
      set('newfolder', $newfiles);
      set('folder', $folder);

      $files .= partial('_folder.html.php');

    } else {
      $file = array(
        'filepath'  => UPLOADS_DIR."$dir/".rawurlencode($name),
        'name'      => $name,
        'shortname' => getShortname($name),
        'img'       => getExtensionImage($filepath),
        'size'      => fileSizeConvert(filesize($filepath)),
        'date'      => dateConvert(filemtime($filepath)),
      );

      set('newfile', $newfiles);
      set('file', $file);

      $files .= partial('_file.html.php');
    }
  }

  return $files;
}
