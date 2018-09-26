<?php 



	//The Json object that this script recieves is from index.js and looks like this:
	//var jsonPayload = '{"first" : "' + shinyFirstName + '", "last" : "' + shinyLastName + '", "userNew" : "' + shinyUserName + '",
	//"password": "' + hashedPassword + '", "email" : "' + shinyEmail + '"}';
	// Put json into array
	$inData = getRequestInfo();

	// Assign variables json strings
	$firstName = preg_replace("/[^a-zA-Z]/","",$inData["first"]);
	$lastName = preg_replace("/[^a-zA-Z]/","",$inData["last"]);
	$user = preg_replace("/[^A-Za-z0-9]/","",$inData["userNew"]);
	$password1 = preg_replace("/[^A-Za-z0-9!@#$%^&*]/","",$inData["password"]);
	$email = preg_replace("/[^A-Za-z0-9|@|.]/","",$inData["email"]);
	if(strlen($password1)<4)
	{
		returnWithError("password must be at least 4 characters long.");
		exit();
	}
	elseif(strlen($password>32))
	{
		returnWithError("password must be less than 32 characters long.");
		exit();
	}
	else
	{
		//noop
	}
	// Info for server and database access -- change values to server info on aws
	$database = 'conmandatabase';
	$username = 'conman';
	$password = 'bananasAreActuallyCorn72!';
	$server = 'mydatabase.c7s05rybpupb.us-east-2.rds.amazonaws.com';

	// Connect to remote database on server
	$conn = new mysqli($server, $username, $password, $database);

	// Failed to connect to server -- return error
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}

	// Create new user
	else
	{
		// Check if email already exists
		$sql = "select email from users where email = '$email'";
		$result = $conn->query($sql);

		// This works correctly just gotta make sure json is being passed in 
		if($result->num_rows > 0)
		{
			returnWithError("An account has already been create using this email");
			exit();
		}

		/*
		if(!$result)
		{
			returnWithError("An account has already been created using this email");
			exit();
		}
		*/
		
		// Hashes the password 
		$hash = password_hash($password1, PASSWORD_DEFAULT);
		

		// Insert data into database
		// These values are the columns in my localhost database 
		// so they may change once I create the columns on the remote database on aws server
		$sql = 'insert into users (firstName, lastName, password, username, email) values ' . "('$firstName', '$lastName', '$hash', '$user', '$email')";

		$result = $conn->query($sql);

		if(!$result)
			returnWithError($conn->error);

		$conn->close();
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		//echo $obj;
	}

	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

 ?>
