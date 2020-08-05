<?php
if (is_string($read_id)) {
	echo "string";
} else {
	echo "Int";
}

?>
<div class="row">
	<div class="col-lg-12">
		<div class="panel panel-default">
	  		<div class="panel-body">
	  			<div class="row">
					<div class="col-lg-12">
	  					<iframe id="pdf-viewer" style="width: 100%; height: 700px; border: 0" src="<?php echo Yii::app()->request->baseUrl; ?>/web/viewer.html"><?php echo Yii::app()->request->baseUrl ."/uploads/viewer.html"; ?></iframe>
					</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>