<div class="file <?= $newfile ? 'newfile' : '' ?>" <?= $newfile ? 'style="display: none"' : '' ?> data-url="public/uploads/<?= $file['name'] ?>">
  <img src="public/img/extensions/<?= urlencode($file['img']) ?>" />

  <?php if($file['shortname'] != $file['name']): ?>
    <span class="shortname label label-default" data-toggle="tooltip" data-title="<?= htmlentities($file['name']) ?>"><?= str_replace('...', '&hellip;', htmlentities($file['shortname'])) ?></span>
  <?php else: ?>
    <span class="shortname label label-default"><?= str_replace('...', '&hellip;', htmlentities($file['shortname'])) ?></span>
  <?php endif; ?>

  <div class="download">
    <span class="filename"><?= htmlentities($file['name']) ?></span>
    <a href="<?= $file['filename'] ?>" class="downloadfile btn btn-success"><?= T_("Download") ?></a>
    <span class="filesize"><strong><?= T_("Size:") ?></strong> <?= $file['size'] ?></span> -
    <span class="filedate"><strong><?= T_("Date:") ?></strong> <?= str_replace(' ', '&nbsp;', $file['date']) ?></span>
  </div>
</div>
