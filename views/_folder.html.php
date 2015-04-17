<div class="folder <?= $newfolder ? 'newfolder' : '' ?>" <?= $newfolder ? 'style="display: none"' : '' ?> data-path="<?= $folder['path']  ?>">
  <img src="public/img/extensions/folder-page.png" />
  <span class="shortname label label-default"><?= htmlentities($folder['name']) ?></span>
</div>
