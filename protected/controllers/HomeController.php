<?php

class HomeController extends Controller
{
	public $layout='column2';
	#$id = $this->user_id;

	public function actionIndex(){
		$this->render('index');
	}

	public function actionUploads(){
		$id = Yii::app()->user->user_id;
		$model = Uploads::model()->getMyUploads($id);

		$this->render('upload',array('model'=>$model));
	}

	public function actionNewupload(){
		if (!defined('CRYPT_BLOWFISH')||!CRYPT_BLOWFISH)
			throw new CHttpException(500,"This application requires that PHP was compiled with Blowfish support for crypt().");

		$model=new NewPosts;#echo"<pre>".print_r($model,1);exit();
		/*if(isset($_POST['ajax']) && $_POST['ajax']==='uploads-form'){
		        echo CActiveForm::validate($model);
		        Yii::app()->end();
		    }*/
		   $message = [];
		if(isset($_POST['NewPosts'])){
	        $model->attributes=$_POST['NewPosts'];

	        $path = YiiBase::getPathOfAlias('webroot').'/uploads/';
	        $data = (object)$model->attributes;
	       	$data->path = $path;
	        
	    	$upload=CUploadedFile::getInstance($model,'upload_file');
	    	
	    	$runner = new Common;
	    	$message = $runner->UploadPost($upload,$data);


	    }
		$this->render('newupload',['model'=>$model,'message'=>$message]);
	}

	public function actionshared(){
		
		$model = Uploads::model()->getSharedUploads();
		$this->render('shared',array('model'=>$model));
	}

	public function actionRead(){
		$read_id = $_GET['readid'];
		$readhash = $_GET['securitykey'];

		$toen = date('Ymd').Yii::app()->user->id_number.date('d').$read_id;
		$encrypt = md5($toen);

		if ($readhash == $encrypt) {
			$this->render('read',['read_id'=>$read_id]);
		} else {
			$this->render('read',['read_id'=>'<div class="alert alert-danger">Invalid Security Key</div>']);
		}
		
		
	}

}