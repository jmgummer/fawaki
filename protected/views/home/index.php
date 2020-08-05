<?php
/* @var $this HomeController */

$this->breadcrumbs=array(
	'Home',
);
$runner = new Common;
?>

<?php # Yii::app()->user->id_number; ?>

<p>
	Hello and Welcome <?php echo Yii::app()->user->username; ?>,<br>
	Below Is a summery Of Activities:-<br>
</p>
<div class="row">
	<div class="col-md-4">
		<fieldset style="box-shadow:0em 0em 0.5em" class="alert alert-danger">
			<h3><label><span class = 'fa fa-lg fa-fw fa-archive'></span> My Total Uploads:</label>
			<? $num = Uploads::model()->MyTotalUploads(Yii::app()->user->user_id); 
				echo "$num";
			?>
			</h3>
		</fieldset>
	</div>
	<div class="col-md-4">
		<fieldset style="box-shadow:0em 0em 0.5em" class="alert alert-warning">
			<h3><label><span class = 'fa fa-lg fa-fw fas fa-database'></span> Starage Usage:</label>
			<?php 
				$bytes = Uploads::model()->getTotalSizeUsage(Yii::app()->user->user_id);
				$size = $runner->formatBytes($bytes);
				echo "$size";
				?>
			</h3>
		</fieldset>
	</div>
	<div class="col-md-4">
		<fieldset style="box-shadow:0em 0em 0.5em" class="alert alert-success">
			<h3><label>Last Login</label></h3>
		</fieldset>
	</div>
</div>
