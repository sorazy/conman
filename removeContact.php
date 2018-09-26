<?php

	$inData = getRequestInfo();

	// Assign variables json strings
	// reference the json in the javascript code
	$ID = $inData["contactID"];


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
		$sql = "delete from contacts where contactID = '$ID'";
		//$sql = "insert into contacts (firstName, lastName, phoneNumber, email, userID, address) values" . "('test', 'test', 'test', 'test', 10, 'test');";
		$result = $conn->query($sql);

		// This works correctly just gotta make sure json is being passed in
		if(!$result)
		{
				returnWithError("invalid contactID");
		}

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
