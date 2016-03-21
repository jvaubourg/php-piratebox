<!doctype html>

<!--
  php-piratebox
  Copyright (C) 2015 Julien Vaubourg <julien@vaubourg.com>
  Contribute at https://github.com/jvaubourg/php-piratebox
  
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.
  
  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->

<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]> <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]> <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="<?= $locale ?>"> <!--<![endif]-->
<head>
  <title><?= option('app_name') ?></title>

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

  <link media="all" type="text/css" href="<?= ROOT_DIR.PUBLIC_DIR ?>bootstrap/css/bootstrap.min.css" rel="stylesheet">
  <link media="all" type="text/css" href="<?= ROOT_DIR.PUBLIC_DIR ?>bootstrap/css/bootstrap-theme.min.css" rel="stylesheet">
  <link media="all" type="text/css" href="<?= ROOT_DIR.PUBLIC_DIR ?>css/filedrop.css" rel="stylesheet">
  <link media="all" type="text/css" href="<?= ROOT_DIR.PUBLIC_DIR ?>css/contextMenu.css" rel="stylesheet">
  <link media="all" type="text/css" href="<?= ROOT_DIR.PUBLIC_DIR ?>css/style.css" rel="stylesheet">

  <script src="<?= ROOT_DIR.PUBLIC_DIR ?>jquery/jquery-2.1.1.min.js"></script>
  <script src="<?= ROOT_DIR.PUBLIC_DIR ?>bootstrap/js/bootstrap.min.js"></script>
  <script src="<?= ROOT_DIR.PUBLIC_DIR ?>js/filedrop.min.js"></script>
  <script src="<?= ROOT_DIR.PUBLIC_DIR ?>js/contextMenu.js"></script>
  <script src="<?= ROOT_DIR.PUBLIC_DIR ?>js/functions.js"></script>
  <script src="<?= ROOT_DIR.PUBLIC_DIR ?>js/events.js"></script>
</head>

<body data-opt-base-uri="<?= option('base_uri') ?>">
  <div id="main" class="container">
    <?= $content?>

    <div id="footer">
      <hr />
      <div id="github"><a href="https://github.com/jvaubourg/php-piratebox"><?= _('Any problem? Contribute!') ?></a> - AGPL 3.0</div>
    </div>
  </div>
</body>

</html>
