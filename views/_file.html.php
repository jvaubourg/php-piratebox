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
?>

<div class="itemfile file <?= $newfile ? 'newfile' : '' ?>" <?= $newfile ? 'style="display: none"' : '' ?>>
  <img src="<?= ROOT_DIR.PUBLIC_DIR ?>img/extensions/<?= urlencode($file['img']) ?>" />

  <?php if($file['shortname'] != $file['name']): ?>
    <span class="shortname label label-default" data-toggle="tooltip" data-title="<?= htmlentities($file['name']) ?>"><?= str_replace('...', '&hellip;', htmlentities($file['shortname'])) ?></span>
  <?php else: ?>
    <span class="shortname label label-default"><?= str_replace('...', '&hellip;', htmlentities($file['shortname'])) ?></span>
  <?php endif; ?>

  <div class="download">
    <span id="closedownload" class="glyphicon glyphicon-chevron-up"></span>
    <span class="filename"><?= htmlentities($file['name']) ?></span>
    <a href="<?= $file['filename'] ?>" class="downloadfile btn btn-success"><?= T_("Download") ?></a>
    <span class="filesize label label-default"><?= $file['size'] ?></span>
    <span class="filedate label label-default"><?= str_replace(' ', '&nbsp;', $file['date']) ?></span>
    <span class="filerename label label-danger" <?= option('allow_renaming') ? '' : 'style="display: none"' ?>><span class="glyphicon glyphicon-edit"></span> <?= T_("Rename") ?></span>
    <span class="filedelete label label-danger" <?= option('allow_deleting') ? '' : 'style="display: none"' ?>><span class="glyphicon glyphicon-trash"></span> <?= T_("Delete") ?></span>
  </div>
</div>
