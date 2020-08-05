<?php 
	$user_id =  Yii::app()->user->user_id;
	$username =  Yii::app()->user->username;
	$id_number =  Yii::app()->user->id_number;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="en" />

	<!-- blueprint CSS framework -->
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/screen.css" media="screen, projection" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/print.css" media="print" />
	<!--[if lt IE 8]>
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/ie.css" media="screen, projection" />
	<![endif]-->
	

	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/main.css" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/form.css" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/app_menu.css" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/select2.min.css" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/dataTables-1.10.19.min.css" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/boostrap/bootstrap.min.css" />
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

	<script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/jquery.min.js"></script>
	<script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/url.js"></script>
	<script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/app.js"></script>

	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body class=" fixed-header fixed-navigation ">
	<div id="preLoaderDiv">
		    <img id="preloaderAnimation" src="<?php echo Yii::app()->request->baseUrl . '/images/loading.gif'; ?>" />
	</div>
<div class="container-fluid" id="page">

	<div id="header">
		<div id="logo"></div>
		<nav class="navbar navbar-fixed-top navbar-inverse">
			<div class="navbar-header">
				<ul class="nav navbar-nav">
					<li><a class="navbar-brand" title="Look with your special eyes" href="#"><?php echo CHtml::encode(Yii::app()->name); ?></a></li>
					<!-- <li><a href="http://www.erikashewan.com" target="_blank">About</a></li> -->
					<li><a href="<?=Yii::app()->createUrl("site/logout");?>" title="Sign Out"><i class="fa fa-sign-out"></i>Sign Out</a></li>
				</ul>
			</div>
		</nav>	
	</div><!-- header -->

		<aside id="left-panel" style="min-height:100%">
		<!-- User info -->
			<div class="login-info">
				<span> <!-- User image size is adjusted inside CSS, it should stay as it --> 
					<a href="javascript:void(0);" id="show-shortcut">
						<img src="<?php echo Yii::app()->request->baseUrl . '/images/avatars/male.png'; ?>" alt="me" class="online" /> 
						<span>
							<?php echo Yii::app()->user->username; ?>
						</span>
					</a> 
					
				</span>
			</div>
			<div class="sidebar">
				<nav>
					<ul class="nav nav-sidebar">
						<li>
							<a href="<?=Yii::app()->createUrl("home/index");?>" title="Dashboard">
							<img src="<?php echo Yii::app()->request->baseUrl . '/images/avatars/dashboard.png'; ?>  " width='25' height="20"><span class="menu-item-parent">Dashboard</span></a>
						</li>
						<li>
							<a href="<?=Yii::app()->createUrl("home/Uploads");?>" title="Uploads">
								<img src="<?php echo Yii::app()->request->baseUrl . '/images/avatars/folder.png'; ?>  " width='25' height="20"> <span class="menu-item-parent">My Uploads</span></a>
						</li>
						<li>
							<a href="<?=Yii::app()->createUrl("home/shared");?>" title="Shared Files">
							<img src="<?php echo Yii::app()->request->baseUrl . '/images/avatars/shared.png'; ?> " width='25' height="20"> <span class="menu-item-parent">Shared Files</span></a>
						</li>
						<li>
							<a href="<?=Yii::app()->createUrl("account/index");?>" title="My Account">
								<img src="<?php echo Yii::app()->request->baseUrl . '/images/avatars/google.png'; ?>  " width='25' height="20"> <span class="menu-item-parent">My Account</span></a>
						</li>

					</ul>
				</nav>
				<span class="minifyme" id="slideopen"><i class="fa fa-arrow-circle-left hit" style="margin-top:4px;"></i></span>
			</div>
		
	</aside>
</div>
	<div id="main" role="main">
	<?php echo $content; ?>
	</div>
	<div id="footer">
		Copyright &copy; <?php echo date('Y'); ?> by Gummer.<br/>
		All Rights Reserved.<br/>
	</div><!-- footer -->


</body>
<script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/select2.min.js"></script>
<script type="text/javascript" src="<?php echo Yii::app()->request->baseUrl; ?>/js/dataTables-1.10.19.min.js"></script>
<script type="text/javascript">
	$(document).ready(function() {
    $('.datatable').DataTable();
    //$('.select2').select2();
} );
</script>
</html>