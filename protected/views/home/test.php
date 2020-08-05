<?php
/* @var $this UploadsController */
/* @var $model Uploads */
/* @var $form CActiveForm */
?>

<div class="form" style="box-shadow: 0em 0em 0.5em">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'uploads-form',
	'class'=>'well',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// See class documentation of CActiveForm for details on this,
	// you need to use the performAjaxValidation()-method described there.
	'enableAjaxValidation'=>true,
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>

	<div class="row">
		<?php echo $form->labelEx($model,'title'); ?>
		<?php echo $form->textField($model,'title'); ?>
		<?php echo $form->error($model,'title'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'upload_file'); ?>
		<?php echo $form->textField($model,'upload_file'); ?>
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
		<?php echo $form->textField($model,'shared'); ?>
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

</div><!-- form -->