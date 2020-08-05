<?php
class NewPosts extends CFormModel{
	public $title;
	public $upload_file;
	public $create_time;
	public $author_id;
	public $shared;
	public $status;

	private $_post;

	public function rules(){
		return array(
			// username and password are required
			array('title, upload_file, create_time, author_id, shared, status', 'required'),
			array('title, upload_file, create_time, author_id, shared, status','safe'),
		);
	}

	public function attributeLabels(){
		return array(
			'title'=>'Title',
			'upload_file'=>'Upload File',
			'create_time'=>'Shared',
		);
	}

	public function ProcessPost($array){	
		
		echo "<pre>".print_r($array,1);exit();
	}

}