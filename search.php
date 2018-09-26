<?php 	
	// Get data from xhr in index.js
	$inData = getRequestInfo();
	
	// Extract data from JSON
	$name = $inData["search"];
	$id = $inData["userId"];

	// Database credentials
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
		$sql = "select * from contacts where (firstName like '%$name%' or lastName like '%$name%' 
				or phoneNumber like '%$name%' or email like '%$name%' or address like '%$name%') 
				and userID = '$id' ORDER BY lastName;";
		
		$result = $conn->query($sql);

		// This works correctly just gotta make sure json is being passed in 
		if ($result->num_rows > 0)
		{
			while($row = $result->fetch_assoc())
			{
				$searchCount++;
				$searchResults .= '{"firstName" : "' . $row["firstName"] . '", "lastName" : "' .$row["lastName"]. '", "phoneNumber" : "' .$row["phoneNumber"]. '", "email" : "' . $row["email"] . '", "address" : "' . $row["address"] . '", "contactID" : "' . $row["contactID"] . '"}||';
			}
		}
		else
		{
			returnWithInfo('{"contactID" : -1}');
			exit();
		}
		
		$conn->close();
	}

	returnWithInfo( $searchResults );

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	
		
	function returnWithInfo( $searchResults )
	{
		$retValue = $searchResults;
		//echo $retValue;
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