<div class="form login">
<?php $form=$this->beginWidget('CActiveForm'); ?>
	<p>Please enter your password</p>

	<?php echo $form->passwordField($model,'username'); ?>
	<?php echo $form->error($model,'username'); ?>

	<?php echo $form->passwordField($model,'id_number'); ?>
	<?php echo $form->error($model,'id_number'); ?>

	<?php echo $form->passwordField($model,'password'); ?>
	<?php echo $form->error($model,'password'); ?>

	<?php echo CHtml::submitButton('Enter'); ?>

<?php $this->endWidget(); ?>
</div><!-- form -->
