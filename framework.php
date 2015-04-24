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

require('config.php');

// Limonade configuration
function configure() {
  $GLOBALS['options']['public_dir'] = "public";
  $GLOBALS['options']['public_uploads_dir'] = "uploads";
  $GLOBALS['options']['public_chat_dir'] = "chat";

  $GLOBALS['options']['base_path'] = preg_replace('/\/+$/', '', $GLOBALS['options']['base_path']);
  $GLOBALS['options']['base_uri'] = preg_replace('/\/+$/', '', $GLOBALS['options']['base_uri']);

  option('app_name', $GLOBALS['options']['app_name']);
  option('env', ENV_PRODUCTION);
  option('debug', false);
  option('base_path', $GLOBALS['options']['base_path'].'/');
  option('base_uri', $GLOBALS['options']['base_uri'].'/');

  option('allow_renaming', $GLOBALS['options']['allow_renaming']);
  option('allow_deleting', $GLOBALS['options']['allow_deleting']);
  option('allow_newfolders', $GLOBALS['options']['allow_newfolders']);
  option('enable_chat', $GLOBALS['options']['enable_chat']);
  option('default_pseudo', $GLOBALS['options']['default_pseudo']);
  option('time_format', $GLOBALS['options']['time_format']);
  option('fancyurls', $GLOBALS['options']['fancyurls']);

  layout("layout.html.php");

  define('ROOT_DIR', option('base_uri'));
  define('PUBLIC_DIR', $GLOBALS['options']['public_dir'].'/');
  define('UPLOADS_DIR', PUBLIC_DIR.$GLOBALS['options']['public_uploads_dir'].'/');
  define('CHAT_DIR', PUBLIC_DIR.$GLOBALS['options']['public_chat_dir'].'/');

  $uploads_path = isset($GLOBALS['options']['base_uploads']) ? $GLOBALS['options']['base_uploads'] : option('base_path').UPLOADS_DIR;
  $chat_path = isset($GLOBALS['options']['base_chat']) ? $GLOBALS['options']['base_chat'] : option('base_path').CHAT_DIR;

  $uploads_path = preg_replace('/\/+$/', '', $uploads_path);
  $chat_path = preg_replace('/\/+$/', '', $chat_path);

  define('UPLOADS_PATH', "$uploads_path/");
  define('CHAT_PATH', "$chat_path/");
}

// Not found page
function not_found($errno, $errstr, $errfile=null, $errline=null) {
  $msg = h(rawurldecode($errstr));

  return render($msg, 'error_layout.html.php');
}

function T_($string) {
  return gettext($string);
}

// Before routing
function before($route) {
   /**
   * * Locale
   * */
  if (!isset($_SESSION['locale'])) {
      $locale = explode(',',$_SERVER['HTTP_ACCEPT_LANGUAGE']);
      $_SESSION['locale'] = strtolower(substr(chop($locale[0]),0,2));
  }
  $textdomain="localization";
  putenv('LANGUAGE='.$_SESSION['locale']);
  putenv('LANG='.$_SESSION['locale']);
  putenv('LC_ALL='.$_SESSION['locale']);
  putenv('LC_MESSAGES='.$_SESSION['locale']);
  setlocale(LC_ALL,$_SESSION['locale']);
  setlocale(LC_CTYPE,$_SESSION['locale']);
  $locales_dir = dirname(__FILE__).'/../i18n';
  bindtextdomain($textdomain,$locales_dir);
  bind_textdomain_codeset($textdomain, 'UTF-8');
  textdomain($textdomain);
  // Set the $locale variable in template
  set('locale', $_SESSION['locale']);
}

// After routing
function after($output, $route) {
  /*
  $time = number_format( (float)substr(microtime(), 0, 10) - LIM_START_MICROTIME, 6);
  $output .= "\n<!-- page rendered in $time sec., on ".date(DATE_RFC822)." -->\n";
  $output .= "<!-- for route\n";
  $output .= print_r($route, true);
  $output .= "-->";
  */
  return $output;
}
