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

<h1><?= T_("PirateBox") ?><span id="gotoupload" class="btn btn-success" data-placement="bottom" data-toggle="tooltip" data-title="<?= T_('Go to upload') ?>"><span class="glyphicon glyphicon-hand-down"></span></span></h1>

<h2><?= T_("Download the others' files") ?></h2>

<div id="files">

<ol class="breadcrumb" id="nav">
  <li class="active"><?= T_("Root") ?></li>
</ol>

<div id="infiles">

<?= $files ?>

</div>
</div>

<h2><?= T_("Share your own files") ?></h2>

<div id="upload">
  <div id="dragndrop">
    <span id="dndtxt"><?= T_("Drag &amp; drop here") ?></span>
    <span id="ortxt">-<?= T_("or") ?>-</span>
    <span id="uploadfile" class="btn btn-success"><?= T_('Click to open the file browser') ?></span>
  </div>

  <div id="bars"></div>

  <div id="createfolder">
    <a id="createfolderbtn" class="btn btn-success"><span class="glyphicon glyphicon-folder-open"></span>&nbsp; <?= T_('Create a folder') ?></a>

    <div id="createfolderinput" class="row">
      <div class="col-lg-3">
        <div class="input-group">
          <input type="text" class="form-control" maxlength="20" placeholder="<?= T_("Folder name") ?>" />
          <span class="input-group-btn">
            <button class="btn btn-default" type="button"><?= T_("OK") ?></button>
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
