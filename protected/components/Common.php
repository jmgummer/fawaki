<?php
class Common extends Dbmethods{
	
	function __construct(){
		$this->conn = Dbmethods::ConnectDB();
	}

	//Uploading POST

	public function UploadPost($upload,$model){
		$con = $this->conn;

		$title = $model->title;
		$create_time = $model->create_time;
		$author_id = $model->author_id;
		$shared = $model->shared;
		$status = $model->status;
		$path = $model->path;
		$file = $upload->name;
	    $size = $upload->size;
	    $tmp = $upload->tempName;
	    $error = $upload->error;
	    $ext = $this->getFileExtention($file);

	    $newfile = $this->HashFile($file);
	    $newPath = $path.$newfile;

	    $destination = $path.$file;

	    $uploadOk = 1;

	    if ($title == '') {
	    	$message = $this->ErrorOpenTag()."Sorry, Please Set Title Of Your Upload.".$this->CloseDivTag();
	    	$uploadOk = 0;
	    }
	    if ($size > 500000) {
	    	$message = $this->ErrorOpenTag()."Sorry, your file is too large.".$this->CloseDivTag();
	    	$uploadOk = 0;
	    }
	    if($ext != "jpg" &&  $ext != "jpeg" && $ext != "pdf" &&  $ext != "doc" &&  $ext != "xlsx" &&  $ext != "ppt" &&  $ext != "pdf"){
	    	$message = $this->ErrorOpenTag()."Sorry, only JPG, JPEG, DOC ,PPT , xlsx& PDF files are allowed.".$this->CloseDivTag();
	    	$uploadOk = 0;
	    }

	 	if ($uploadOk == 1) {
	 		if (move_uploaded_file($tmp,$destination)) {
			    $sq = "INSERT INTO uploads (title,upload_file,tags,upload_path,create_time,author_id,shared,status,filesize) 
			    		VALUES('$title','$newfile','$ext','$path','$create_time',$author_id,$shared,$status,$size)";
			    $q = $con->query($sq) or die($this->ErrorOpenTag()."Sorry, there was an error uploading your file,.<br>".$this->CloseDivTag());
			    if ($q) {
			    	$message = $this->SuccessOpenTag()."File {{$file}} has been uploaded.".$this->CloseDivTag();
			    	rename($destination, $newPath);
			    }
	    	}else{
			    $message = $this->ErrorOpenTag()."Sorry, there was an error uploading your file.<br>$error".$this->CloseDivTag();
	    	}
	 	}
	 	echo Yii::app()->user->getFlash($message);
	 	return $message;
	}

	public function getFileExtention($file){
		 $ext = pathinfo($file, PATHINFO_EXTENSION);
		 return $ext;
	}

	public function random(){
	  $charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	  $charset = str_shuffle($charset);
	  $charset = substr($charset, 0,4);


	  return $charset;
	}

	public function HashFile($file){
		$hash = $this->random();

		$explode = explode('.', $file);
		$file = $explode[0];
		$ext = $explode[1];

		$filename = $file."_".$hash.'.'.$ext;
		return $filename;
	}

	public function ErrorOpenTag(){
		$tag = "<div class = 'alert alert-danger'>";
		return $tag;
	}

	public function SuccessOpenTag(){
		$tag = "<div class = 'alert alert-success'>";
		return $tag;
	}

	public function CloseDivTag(){
		return '</div>';
	}

	public function getUsername($id){
		$con = $this->conn;

		$sq = "SELECT firstname,surname from users_table WHERE auto_id = $id";
		$q = $con->query($sq);
		if ($q) {
			$row = $q->fetch_assoc();
			$username = $row['firstname']. ' '. $row['surname'];
		}else{
			$username = 'Not Defined';
		}

		return $username;
	}

	public function formatBytes($size) { 
		$precision= 2;
    $base = log($size, 1024);
    $suffixes = array('', 'K', 'M', 'G', 'T');   

    $size =  round(pow(1024, $base - floor($base)), $precision) .' '. $suffixes[floor($base)];

    return $size; 
} 
}