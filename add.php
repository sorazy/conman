<?php 	

	$inData = getRequestInfo();
	
	// Assign variables json strings 
	// reference the json in the javascript code 
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$address = $inData["address"];
	$id = $inData["userId"];

	//$contactId = 0;


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
		if ($email != "")
		{
			$query = "select count(email) as emailCount from contacts where email = '$email' and userID = '$id'";
			$result = $conn->query($query);

			$row = $result->fetch_assoc();

			if ($row["emailCount"] > 0)
			{
				returnWithInfo('{"contactID" : -1}');
				exit();
			}
		}
		
		// Check if email already exists
		$sql = "insert into contacts (firstName, lastName, phoneNumber, email, userID, address) values" . "('$firstName', '$lastName', '$phone', '$email', '$id', '$address')";
		//$sql = "insert into contacts (firstName, lastName, phoneNumber, email, userID, address) values" . "('test', 'test', 'test', 'test', 10, 'test');";
		$result = $conn->query($sql);

		// This works correctly just gotta make sure json is being passed in 
		
		if(!$result)
		{
			returnWithError("Unable to add contact");
		}
		
/*
		$query = "select contactID from contacts where userID = '$id' and email = '$email';";
		$result = $conn->query($query);

		if($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			//$contactId = $row['contactID'];
			returnWithInfo($contactId);
		}
		else
			returnWithError("Unable to find contact");
			*/

		$conn->close();
	}

	returnWithInfo($firstName, $lastName, $phone, $email, $address);

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	
		
	function returnWithInfo($id )
	{
		$retValue = '{"contactid":"' . $id . '""}';
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