<?php
	echo $this->pageTitle=Yii::app()->name.' | Uploads';
	$this->breadcrumbs=array('New upload');

/*	$this->widget('bootstrap.widgets.TbAlert', array(
    'block'=>true, // display a larger alert block?
    'fade'=>true, // use transitions?
    'closeText'=>'&times;', // close link text - if set to false, no close link is displayed
    'alerts'=>array( // configurations per alert type
        'success'=>array('block'=>true, 'fade'=>true, 'closeText'=>'&times;'), // success, info, warning, error or danger
    ),
));*/
?>
<div class="form" style="box-shadow: 0em 0em 0.5em;margin-top:10px;">

		<div>
			<?php
				$message = $message;
				echo "$message";
			?>
		</div>
	<?php $form = $this->beginWidget('CActiveForm',array(
		'id'=>'uploads-form',
		// Please note: When you enable ajax validation, make sure the corresponding
		// controller action is handling ajax validation correctly.
		// See class documentation of CActiveForm for details on this,
		// you need to use the performAjaxValidation()-method described there.
		'enableAjaxValidation'=>true,
		'htmlOptions'=>['class'=>'alert alert-default','enctype'=>'multipart/form-data']
	));?>

	<div class="well">

		<p class="note">Fields with <span class="required">*</span> are required.</p>

		<?php echo $form->errorSummary($model); ?>

		<div class="row">
			<?php echo $form->labelEx($model,'title'); ?>
			<?php echo $form->textField($model,'title',['class'=>'form-control','Placeholder'=>'Name Your Upload']); ?>
			<?php echo $form->error($model,'title'); ?>
		</div>

		<div class="row">
			<?php echo $form->labelEx($model,'upload_file'); ?>
			<?php echo $form->FileField($model,'upload_file',['class'=>'form-control']); ?>
			<?php echo $form->error($model,'upload_file'); ?>
		</div>

		<div class="row">
			<?php echo $form->textField($model,'create_time',['value'=>date('Y-m-d H:i:s'),'readonly'=>'readonly','hidden'=>'hidden']); ?>
			<?php echo $form->error($model,'create_time'); ?>
		</div>

		<div class="row">
			<?php echo $form->textField($model,'author_id',['value'=>Yii::app()->user->user_id,'readonly'=>'readonly','hidden'=>'hidden']); ?>
			<?php echo $form->error($model,'author_id'); ?>
		</div>

		<div class="row">
			<?php echo $form->labelEx($model,'shared'); ?>
			<?php echo $form->dropDownList($model,'shared',[''=>'Would You Like To Share This Post With Others',0=>'No',1=>'Yes'],['class'=>'form-control select2']); ?>
			<?php echo $form->error($model,'shared'); ?>
		</div>

		<div class="row">
			<?php echo $form->textField($model,'status',['value'=>1,'readonly'=>'readonly','hidden'=>'hidden']); ?>
			<?php echo $form->error($model,'status'); ?>
		</div>


		<div class="row buttons">
			<?php echo CHtml::submitButton('Submit'); ?>
		</div>

	<?php $this->endWidget(); ?>
</div>
</div><!-- form -->
<script type="text/javascript">
	$(document).ready(function () {
		$('#uploads-form').reset().trigger('reset');
	});
</script>