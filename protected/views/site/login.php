<?php
$this->pageTitle=Yii::app()->name . ' - Login';

?>

<h1>Login</h1>

<p>Please fill out the following form with your login credentials:</p>


<div class="form">
	<fieldset style="box-shadow:0em 0em 0.5em">
		<div class="row">
			<div class="col-md-8">
				<span id="logo"><img src="<?php echo Yii::app()->request->baseUrl . '/images/login_header.jpg'; ?>" alt="<?php echo CHtml::encode(Yii::app()->name); ?>" width="600" height="300"></span>
			</div>
			<div class="col-md-4">
				<?php $form=$this->beginWidget('CActiveForm', array(
					'id'=>'login-form',
					'enableAjaxValidation'=>true,
				)); ?>

					<p class="note">Fields with <span class="required">*</span> are required.</p>

					<div class="row">
						<?php echo $form->labelEx($model,'username'); ?>
						<?php echo $form->textField($model,'username'); ?>
						<?php echo $form->error($model,'username'); ?>
					</div>

					<div class="row">
						<?php echo $form->labelEx($model,'id_number'); ?>
						<?php echo $form->passwordField($model,'id_number'); ?>
						<?php echo $form->error($model,'id_number'); ?>
					</div>

					<div class="row">
						<?php echo $form->labelEx($model,'password'); ?>
						<?php echo $form->passwordField($model,'password'); ?>
						<?php echo $form->error($model,'password'); ?>
					</div>

					<div class="row rememberMe">
						<?php echo $form->checkBox($model,'rememberMe'); ?>
						<?php echo $form->label($model,'rememberMe'); ?>
						<?php echo $form->error($model,'rememberMe'); ?>
					</div>

					<div class="row submit">
						<?php echo CHtml::submitButton('Login'); ?>
					</div>

				<?php $this->endWidget(); ?>
			</div>
		</div>
	</fieldset>
</div><!-- form -->
