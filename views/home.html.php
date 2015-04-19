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

<nav class="navbar navbar-default navbar-inverse">
  <div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="<?= ROOT_DIR ?>"><?= option('app') ?></a>
    </div>

    <div class="collapse navbar-collapse" id="menu">
      <ul class="nav navbar-nav">
        <li class="active"><a href="javascript:;" data-tab="files"><?= T_("Files") ?></a></li>
        <li><a href="javascript:;" data-tab="chat"><?= T_("Chat") ?> <span class="badge">0</span></a></li>
      </ul>
      <form class="navbar-form navbar-right">
        <div class="form-group">
          <button type="button" id="gotoupload" class="btn btn-success"><span class="glyphicon glyphicon-file"></span> <?= T_("Upload a new file") ?></button>
          <input type="text" id="pseudoin" class="form-control" maxlength="12" placeholder="<?= T_("Pseudo") ?>" />
        </div>
      </form>
    </div>
  </div>
</nav>

<div id="tabfiles" class="tab"> 
  <div class="panel panel-default"> 
    <div class="panel-heading">
      <h3 class="panel-title"><?= T_("Download the others' files") ?></h3>
    </div>
  
    <div id="files" class="panel-body">
      <ol class="breadcrumb" id="nav" data-cdir="<?= $cdir ?>">
        <li class="active"><?= T_("Root") ?></li>
      </ol>

      <div id="infiles">
        <?= $files ?>
      </div>

      <em id="nofile" <?= empty($files) ? '' : 'style="display: none"' ?>><?= T_("No file yet.") ?></em>
    </div>
  </div>

  <div class="panel panel-default"> 
    <div class="panel-heading">
      <h3 class="panel-title"><?= T_("Share your own files") ?></h3>
    </div>

    <div id="upload" class="panel-body">
      <div id="dragndrop">
        <span id="dndtxt"><?= T_("Drag &amp; drop here") ?></span>
        <span id="ortxt">-<?= T_("or") ?>-</span>
        <span id="uploadfile" class="btn btn-success"><?= T_('Click to open the file browser') ?></span>
      </div>

      <div id="bars"></div>

      <div id="createfolder">
        <a id="createfolderbtn" class="btn btn-success"><span class="glyphicon glyphicon-folder-open"></span>&nbsp; <?= T_('Create a folder') ?></a>

        <div id="createfolderinput" class="row">
          <div class="input-group">
            <input type="text" class="form-control" maxlength="16" placeholder="<?= T_("Folder name") ?>" />
            <span class="input-group-btn">
              <button class="btn btn-success" type="button"><?= T_("OK") ?></button>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="tabchat" class="tab"> 
  <div id="chatlog" data-count="-1"></div>
  <div class="row" id="chatline">
      <div class="input-group">
        <input type="text" id="commentin" class="form-control" placeholder="<?= T_("Comment") ?>">
        <span class="input-group-btn">
          <button class="btn btn-success" id="chatbtn" type="button"><?= T_("Send") ?></button>
        </span>
      </div>
  </div>
</div>
