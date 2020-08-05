<?php

/**
 * UserIdentity represents the data needed to identity a user.
 * It contains the authentication method that checks if the provided
 * data can identity the user.
 */
class UserIdentity extends CUserIdentity
{	
	public $id_number;
	private $_id;

	/**
	 * Authenticates a user.
	 * @return boolean whether authentication succeeds.
	 */
	public function authenticate(){
		$pusername = $this->username;
		$hashedpass = sha1($this->password);
		$uid_number = $this->id_number;

		if($pusername =='' || $hashedpass=='' || $uid_number ==''){
			$this->errorCode=self::ERROR_USERNAME_INVALID;
			echo 'fail';
		}
			
		/*else if(!$user->validatePassword($this->password))
			$this->errorCode=self::ERROR_PASSWORD_INVALID;*/
		else{
			$sq= "SELECT * FROM users_table WHERE username='$pusername' AND `password`='$hashedpass' AND id_number =  '$uid_number' AND `status`=1 ";

			$user = User::model()->findBySql($sq);
			$id_number =  $user['id_number'];
			$username = $user['firstname']. " " . $user['surname'];
			$email = $user['email'];
			$phone_number = $user['phone_number'];
			$id = $user['auto_id'];

			$this->setState('id_number',$id_number);
			$this->setState('username',$username);
			$this->setState('user_id',$id);

			$this->errorCode=self::ERROR_NONE;
		}
		return $this->errorCode==self::ERROR_NONE;
	}

	/**
	 * @return integer the ID of the user record
	 */
	public function getId()
	{
		return $this->_id;
	}
}