<?php 

	
	function userfilter($string) 
	{
		return preg_replace("/[^A-Za-z0-9]/","",$string);
	}
	
	function passfilter($string) 
	{
		return preg_replace("/[^A-Za-z0-9!@#$%^&*]/","",$string);
	}


	
	
	//The JSON that this function receives is from index.js and looks like this:
	//var jsonPayload = '{"Log" : "' + login + '", "password" : "' + hashedPassword + '"}';

	// Put json into array
	$inData = getRequestInfo();
	
	/*
	$cleanData = array(
    'Log'   => userfilter($inData["Log"],
    'password' => passfilter($inData["password"])
	);
	*/
	
	
	
	// Assign variables json strings 
	// reference the json in the javascript code 
	$login = $inData["Log"];
	$pw = $inData["pW"];

	$id = 0;
	$firstName = "";
	$lastName = "";

	// Info for server and database access -- change values to server info on aws
	$database = 'conmandatabase';
	$username = 'conman';
	$password = 'bananasAreActuallyCorn72!';
	$server = 'mydatabase.c7s05rybpupb.us-east-2.rds.amazonaws.com';

	// Connect to remote database on server
	$conn = new mysqli($server, $username, $password, $database);

	//note: this if has one equals because we're checking to see if the function returned with an error or not
	if($conn->connect_error)
	{
		returnWithError($conn->connect_error);
	}
	// Create new user
	else
	{
		// Check if email already exists
		$sql = "select * from users where username = '$login';";
		//$sql = "select * from users where username = 'ramirez1,nak2345' and password = '12345'";
		$result = $conn->query($sql);

		// This works correctly just gotta make sure json is being passed in 
		if($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$firstName = $row['firstName'];
			$lastName = $row['lastName'];
			$id = $row['userID'];
			$hashed = $row['password'];
			$gaahh = password_verify($pw,$hashed);

			if(!$gaahh)
			{
				returnWithError("User does not exist");
				exit();
			}

			returnWithInfo($firstName, $lastName, $id);

		}
		else
		{
			returnWithError("User does not exist");
			exit();
		}
		$conn->close();
	}

	//returnWithInfo($firstName, $lastName, $id);

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
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
