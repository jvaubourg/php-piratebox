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

<nav class="navbar navbar-default navbar-inverse navbar-fixed-top" data-opt-fancyurls="<?= option('fancyurls') ? 'true' : 'false' ?>">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="<?= ROOT_DIR ?>"><?= option('app_name') ?></a>
    </div>

    <div class="collapse navbar-collapse" id="menu">
      <ul class="nav navbar-nav">
        <li class="active"><a href="javascript:;" data-tab="files"><?= _("Files") ?></a></li>
        <li <?= option('enable_chat') ? '' : 'style="display: none"' ?>><a href="javascript:;" data-tab="chat"><?= _("Chat") ?> <span class="badge">0</span></a></li>
      </ul>
      <form class="navbar-form navbar-right">
        <div class="form-group">
          <button type="button" id="gotoupload" class="btn btn-success"><span class="glyphicon glyphicon-file"></span> <?= _("Upload a new file") ?></button>
          <input type="text" id="pseudoin" class="form-control" maxlength="12" placeholder="<?= _("Pseudo") ?>" />
        </div>
      </form>
    </div>
  </div>
</nav>

<div id="tabfiles" class="tab"
  data-txt-delfile="<?= _("Are you sure you want to delete this file?") ?>" 
  data-txt-delfolder="<?= _("Are you sure you want to delete this folder?") ?>"
  data-txt-open="<?= _("Open") ?>"
  data-txt-download="<?= _("Download") ?>"
  data-txt-rename="<?= _("Rename") ?>"
  data-txt-delete="<?= _("Delete") ?>"
  data-opt-allow-renaming="<?= option('allow_renaming') ? 'true' : 'false' ?>"
  data-opt-allow-deleting="<?= option('allow_deleting') ? 'true' : 'false' ?>"
  data-opt-allow-newfolders="<?= option('allow_newfolders') ? 'true' : 'false' ?>">

  <div id="download">
    <span id="closedownload" class="glyphicon glyphicon-remove"></span>
    <span class="filename"></span>
    <a href="#" class="downloadfile btn btn-success"><?= _("Download") ?></a>
    <span class="filesize label label-default"></span>
    <span class="filedate label label-default"></span>
    <span class="filerename label label-danger" data-toggle="tooltip" data-title="<?= _("Rename") ?>" <?= option('allow_renaming') ? '' : 'style="display: none"' ?>><span class="glyphicon glyphicon-edit"></span></span>
    <span class="filedelete label label-danger" data-toggle="tooltip" data-title="<?= _("Delete") ?>" <?= option('allow_deleting') ? '' : 'style="display: none"' ?>><span class="glyphicon glyphicon-trash"></span></span>
  </div>

  <div class="panel panel-default"> 
    <div class="panel-heading">
      <h3 class="panel-title"><?= _("Download the others' files") ?></h3>
    </div>
  
    <div id="files" class="panel-body">
      <ol class="breadcrumb" id="nav" data-cdir="<?= rawurlencode($cdir) ?>" data-locked="<?= $locked ? 'true' : 'false' ?>">
        <li class="active"><?= _("Root") ?></li>
      </ol>

      <div id="infiles">
        <?= $files ?>
      </div>

      <span id="nofile" <?= empty($files) ? '' : 'style="display: none"' ?>>
        <?= _("No files yet.") ?>
        <div><span class="folderdelete label label-danger <?= $locked ? 'lockedaction' : '' ?>" <?= option('allow_deleting') && $cdir != '/' ? '' : 'style="display: none"' ?>><span class="glyphicon glyphicon-trash"></span> <?= _("Delete this folder") ?></span></div>
      </span>
    </div>
  </div>

  <div class="panel panel-default"> 
    <div class="panel-heading">
      <h3 class="panel-title"><?= _("Share your own files") ?></h3>
    </div>

    <div id="upload" class="panel-body">
      <div id="dragndrop">
        <span id="dndtxt"><?= _("Drag &amp; drop here") ?></span>
        <span id="ortxt">-<?= _("or") ?>-</span>
        <span id="uploadfile" class="btn btn-success"><?= _('Click to open the file browser') ?></span>
      </div>

      <div id="bars"></div>

      <div id="createfolder" <?= option('allow_newfolders') ? '' : 'style="display: none"' ?>>
        <a id="createfolderbtn" class="btn btn-success"><span class="glyphicon glyphicon-folder-open"></span>&nbsp; <?= _('Create a folder') ?></a>
  
        <div id="createfolderinput" class="row">
          <div class="input-group">
            <input type="text" class="form-control" maxlength="16" placeholder="<?= _("Folder name") ?>" />
            <span class="input-group-btn">
              <button class="btn btn-success" type="button"><?= _("OK") ?></button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="tabchat" class="tab" <?= option('enable_chat') ? '' : 'style="display: none"' ?>
  data-opt-enable-chat="<?= option('enable_chat') ? 'true' : 'false' ?>"
  data-opt-default-pseudo="<?= option('default_pseudo') ?>">

  <div id="chatlog" data-count="0"><div id="nomsg"><?= _("No messages. You are the first!") ?></div></div>
  <div class="row" id="chatline">
      <div class="input-group">
        <input type="text" id="commentin" class="form-control" placeholder="<?= _("Comment") ?>">
        <span class="input-group-btn">
          <button class="btn btn-success" id="chatbtn" type="button"><?= _("Send") ?></button>
        </span>
      </div>
  </div>
</div>
