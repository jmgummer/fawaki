<?php

/**
 * This is the model class for table "uploads".
 *
 * The followings are the available columns in table 'uploads':
 * @property integer $auto_id
 * @property string $title
 * @property string $upload_file
 * @property string $tags
 * @property string $upload_path
 * @property string $create_time
 * @property integer $author_id
 * @property integer $shared
 * @property string $update_time
 * @property integer $status
 */
class Uploads extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'uploads';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('title, upload_file, create_time, author_id, shared, status', 'required'),
			array('author_id, shared, status,filesize', 'numerical', 'integerOnly'=>true),
			array('title, upload_file, tags, upload_path', 'length', 'max'=>200),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('auto_id, title, upload_file, tags, upload_path, create_time, author_id, shared, update_time, status,filesize', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'auto_id' => 'Auto',
			'title' => 'Title',
			'upload_file' => 'Upload File',
			'tags' => 'Tags',
			'upload_path' => 'Upload Path',
			'create_time' => 'Create Time',
			'author_id' => 'Author',
			'shared' => 'Shared',
			'update_time' => 'Update Time',
			'status' => 'Status',
			'filesize' => 'Filesize',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models
	 * based on the search/filter conditions.
	 */
	public function search()
	{
		// @todo Please modify the following code to remove attributes that should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('auto_id',$this->auto_id);
		$criteria->compare('title',$this->title,true);
		$criteria->compare('upload_file',$this->upload_file,true);
		$criteria->compare('tags',$this->tags,true);
		$criteria->compare('upload_path',$this->upload_path,true);
		$criteria->compare('create_time',$this->create_time,true);
		$criteria->compare('author_id',$this->author_id);
		$criteria->compare('shared',$this->shared);
		$criteria->compare('update_time',$this->update_time,true);
		$criteria->compare('status',$this->status);
		$criteria->compare('filesize',$this->filesize);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Uploads the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	public function getMyUploads($id){
		$sq = "SELECT * FROM uploads WHERE author_id = $id AND status = 1";
        $results = Uploads::model()->findAllBySql($sq);
        return $results;
    }

    public function MyTotalUploads($id){
    	$total = Uploads::model()->count("author_id=$id");
        return $total ;
    }

    public function getTotalSizeUsage($id){
    	/*$criteria = new CDbCriteria;
    	$criteria->select = 'SUM(filesize) as sum';
    	$sql = Yii::app()->db->commandBuilder->CreateFindCommand()*/

    	$sq = "SELECT SUM(filesize) as sum FROM uploads WHERE author_id = $id AND status = 1";
    	$sum = Yii::app()->db->createCommand($sq)->queryScalar();
    	return $sum;
    }

    public function getSharedUploads(){
    	$sq = "SELECT auto_id,title,upload_file,tags,filesize,create_time,author_id FROM uploads
    	 WHERE shared = 1 AND uploads.status = 1";
        $results = Uploads::model()->findAllBySql($sq);
        return $results;
    }
}
