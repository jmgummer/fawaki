<?php
	$this->pageTitle=Yii::app()->name.' | Uploads';
	$this->breadcrumbs=array(
	'Uploads',
);
?>
	<div class="project">
		<?php echo CHtml::link(' Upload New File ',Yii::app()->createUrl("home/newupload"),array('target' => '_blank','class'=>'fa fa-upload btn btn-warning btn-project pull-right')); ?>
	</div>
<?php
	 //TABLE HEADER
      echo CHtml::openTag('table',array('width'=>'100%','class'=>'table table-hover datatable table-bordered table-stripped','id'=>'upload_table'));
      echo CHtml::openTag('thead',array('class'=>"thead-dark"));
      echo CHtml::openTag('tr');
      echo CHtml::tag('th', array(), '#');
      echo CHtml::tag('th', array(), 'Title');
      echo CHtml::tag('th', array(), 'Filename');
      echo CHtml::tag('th', array(), 'File Type');
      echo CHtml::tag('th', array(), 'File Size');
      echo CHtml::tag('th', array(), 'Created On');
      echo CHtml::tag('th', array(), 'View');
      echo CHtml::tag('th', array(), 'Update');
      echo CHtml::tag('th', array(), 'Delete');
       echo CHtml::closeTag('thead');

      $count = 0;
      foreach ($model as  $row) {
      	$count++;
      	echo CHtml::openTag('tr');
      	echo CHtml::Tag('td',array(),$count);
      	echo CHtml::Tag('td',array(),$row['title']);
      	echo CHtml::Tag('td',array(),$row['upload_file']);
      	echo CHtml::Tag('td',array(),$row['tags']);
      	echo CHtml::Tag('td',array(),$row['filesize']);
      	echo CHtml::Tag('td',array(),$row['create_time']);
	    echo CHtml::Tag('td',array(),'--');
	    echo CHtml::Tag('td',array(),'--');
	    echo CHtml::Tag('td',array(),'--');
	    echo CHtml::closeTag('tr'); 
      }
      echo CHtml::closeTag('table');