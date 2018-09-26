//Personal Contact Manager
//COP 4331

// Url
var urlBase = 'ec2-52-15-72-4.us-east-2.compute.amazonaws.com';

var extension = 'php';

var firstName = "";
var lastName = "";
var userID = 0;
var conID = 0;

// Directs to signup
function doSignUp()
{
    document.getElementById('userAddResult').innerHTML = "";
    hideOrShow("signUpButton", true);
    hideOrShow("signUp", false);
    hideOrShow("createAccount", true);
    hideOrShow("loginForm", false);
}

// Back to Login
function backToLogin()
{
    hideOrShow("signUp", true);
    hideOrShow("createAccount", false);
    hideOrShow("loginForm", true);
}

 // Shows search results
function showResults(res)
{
    document.getElementById("searchResults").innerHTML = "";
    var table = document.getElementById("searchResults");
    var i = 0;
    var counter = -1;
    console.log("hello.");
    console.log(res[i]);
    while(res[i] != null)
    {
        var temp = JSON.parse(res[i]);
            console.log("temp contactid is :" + temp.contactID);

        if (temp.contactID == null || temp.contactID == -1)
        {
            console.log("we got here");
            return;
        }

        // Creates new rows <tr> elements
        var row = table.insertRow(++counter);

        // Creates new columns <td> elements
        var s1 = row.insertCell(0);
        var s2 = row.insertCell(1);
        var s3 = row.insertCell(2);
        var s4 = row.insertCell(3);
        var s5 = row.insertCell(4);
        var s6 = row.insertCell(5);
        var s7 = row.insertCell(6);

        // results array from json in search.php
        s1.innerHTML = temp.firstName;
        s2.innerHTML = temp.lastName;
        s3.innerHTML = temp.phoneNumber;
        s4.innerHTML = temp.email;
        s5.innerHTML = temp.address;
        s6.innerHTML = '<button type="submit" onclick="deleteContact('+ counter +');">Delete</button>';
        s7.innerHTML = temp.contactID;
        s7.style = "display:none; visibility:hidden;";

        i++;
    }
}

 // Shows search results
function showAll()
{
    var searchCriteria = "";

    document.getElementById("searchResults").innerHTML = "";

    var jsonPayload = '{"searchCriteria" : "' + searchCriteria + '", "userId" : "' + userID + '"}';
    //var url = urlBase + '/search.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/search.php", true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.send(jsonPayload);
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                var res = xhr.responseText.split("||");

                showResults(res);
            }
        };

    }
    catch(err)
    {
        document.getElementById('logginResult').innerHTML = err.message;
    }

}

function clearAll()
{

}

//secured
function doLogin()
{
    // Get username and password
    var login = document.getElementById('loginUser').value;//.replace(/[^[a-zA-Z0-9]{4,20}]/g, '');
    var password1 = document.getElementById('pwUser').value;//.replace(/[^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,32})]/g, '');
    if(password1.length > 32|| password1.length < 4 || login.length < 4 || login.length > 20)
    {
        alert("Please submit a valid username and password");
        return;
    }

    //turns out javascript encryption sux, leaving this here for now
    //var hashedPassword = crypt(password1,'$2y$09$whatsyourbagelsona?$');

    document.getElementById('logginResult').innerHTML = "";

    // Create json
    var jsonPayload = '{"Log" : "' + login + '", "pW" : "' + password1 + '"}';

    // Send url
    var url = urlBase + '/login.' + extension;
    console.log(url);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/login.php", true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.send(jsonPayload);
        xhr.onreadystatechange = function()
        {
            if (this.readyState == 4 && this.status == 200)
            {
            // Retrieve json from php
            var jsonObject = JSON.parse(xhr.responseText);
            userID = jsonObject.id;
            console.log(userID);
            console.log(jsonObject);

            // Incorrect pass/user
            if(userID < 1)
            {
                console.log("user/pass combo incorrect");
                document.getElementById('logginResult').style = "visibility: visible; opacity: 1; transition: none;";
                document.getElementById('logginResult').getBoundingClientRect();
                document.getElementById("logginResult").innerHTML = "User/password combination incorrect";
                document.getElementById('logginResult').style = "visibility: hidden; opacity: 0; transition: visibility 4s linear 4s, opacity 4s;";
                return;
            }

            document.getElementById('userLog').innerHTML = login;
            document.getElementById('loginUser').value = "";
            document.getElementById('pwUser').value = "";

            hideOrShow("loginForm", false);
            hideOrShow("loggedInDiv", true);
            hideOrShow("createAccount", false);
            hideOrShow("contactList", true);
            hideOrShow("addContactList", true);

            showAll();
            }
        }

    }
    catch(err)
    {
        document.getElementById('logginResult').innerHTML = err.message;
    }

}

// executes logout
function doLogout()
{
    userID = 0;
    firstName = lastName = "";

    resetAdd();

    hideOrShow("loginForm", true);
    hideOrShow("loggedInDiv", false);
    hideOrShow("createAccount", false);
    hideOrShow("contactList", false);
    hideOrShow("addContactList", false);
}

// resets fields for add contact
function resetAdd()
{
    document.getElementById("addFirstName").value = "";
    document.getElementById("addLastName").value = "";
    document.getElementById("addPhoneNumber").value = "";
    document.getElementById("addEmail").value = "";
    document.getElementById("addAddress").value = "";
}

// Add contact
function addContact()
{
    var contactFirstName = document.getElementById("addFirstName").value.replace(/[^a-zA-Z0-9]/g, '');
    var contactLastName = document.getElementById("addLastName").value.replace(/[^a-zA-Z0-9]/g, '');
    var contactPhoneNumber = document.getElementById("addPhoneNumber").value.replace(/[^0-9]/g, '');
    var contactEmail = document.getElementById("addEmail").value.replace(/[^a-zA-Z0-9|@|.]/g, '');
    var contactAddress = document.getElementById("addAddress").value.replace(/[^a-zA-Z0-9]/g, '');

    document.getElementById("contactAddResult").innerHTML = "";

    // Create JSON to send to php
    var jsonPayload = '{"firstName" : "' + contactFirstName + '", "lastName" : "' + contactLastName + '", "phone" : "' + contactPhoneNumber + '", "email": "' + contactEmail  + '", "address" : "' + contactAddress + '", "userId" : "' + userID + '"}';
    var url = urlBase + '/add.' + extension;


    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/add.php", true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        // Send that JSON!!
        xhr.send(jsonPayload);
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                resetAdd();
                showAll();

                document.getElementById('contactAddResult').style = "opacity: 1; transition: none;";
                document.getElementById('contactAddResult').getBoundingClientRect();
                document.getElementById('contactAddResult').innerHTML = "Contact Added!";
                document.getElementById('contactAddResult').style = "opacity: 0; transition: linear 4s, opacity 4s;";
            }
        };
    }
    catch(err)
    {
        document.getElementById('logginResult').innerHTML = err.message;
    }
}

// Delete a contact
function deleteContact( rowNumber )
{
    console.log(rowNumber);
    var toDelete = document.getElementById("searchResults").rows[rowNumber].cells[6].innerHTML;

    var jsonPayload = '{"contactID" : "' + toDelete + '"}';

    var url = urlBase + '/removeContact.' + extension;

    //not sure if this should go above or below the ajax stuff
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/removeContact.php", true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.send(jsonPayload);
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                // needs to be reset del
                showAll();
                document.getElementById('contactAddResult').style = "visibility: visible; opacity: 1; transition: none;";
                document.getElementById('contactAddResult').getBoundingClientRect();
                document.getElementById("contactAddResult").innerHTML = "Contact deleted";
                document.getElementById('contactAddResult').style = "visibility: hidden; opacity: 0; transition: visibility 4s linear 4s, opacity 4s;";
            }
        };
    }
    catch(err)
    {
        document.getElementById('logginResult').innerHTML = err.message;
    }

}

//secured
function registerNewUser()
{
	document.getElementById('logginResult').innerHTML = "";
    // getElementById gets the text in the input where the id = "whatever"
    // Gets the value of each input and stores it in a variable
    var cleanFirstName = document.getElementById("firstName").value.replace(/[^a-zA-Z]/g, '');      //only letters
    //var shinyFirstName = mysqli_real_escape_string(cleanFirstName);
    var cleanLastName = document.getElementById('lastName').value.replace(/[^a-zA-Z]/g, '');        //only letters
    //var shinyLastName = mysqli_real_escape_string(cleanLastName);

    var cleanEmail = document.getElementById('email').value.replace(/[^a-zA-Z|@|.]/g, '');          //only letters, '@', and '.'
    //var shinyEmail = mysqli_real_escape_string(cleanEmail);
    var cleanUserName = document.getElementById('newUser').value.replace(/[^a-z|A-Z|0-9]/g, '');      //only letters and numbers
    //var shinyUserName = mysqli_real_escape_string(cleanUserName);
    /*
    // getElementById gets the text in the input where the id = "whatever"
    // Gets the value of each input and stores it in a variable
    var newFirstName = document.getElementById("firstName").value.replace(/[^a-zA-Z]/g, '');        //only letters
    var newLastName = document.getElementById('lastName').value.replace(/[^a-zA-Z]/g, '');  //only letters
    var email = document.getElementById('email').value.replace(/[^a-zA-Z|@|.]/g, '');                       //only letters, '@', and '.'
    var newUserName = document.getElementById('newUser').value.replace(/[^a-zA-Z0-9]/g, '');        //only letters and numbers
    */



    //NOTE: THIS REGEX NEEDS TESTING
    //What this *should* do is require:
    //>Between 8 and 32 characters
    //>At least one lowercase letter (?=.*[a-z])
    //>At least one uppercase letter (?=.*[A-Z])
    //>At least one number (?=.*[0-9])
    //>At least one special character (?=.*[!@#\$%\^&\*])
    // NOTE TO JONAH: If user registers an with and invalid password, reject immediately.
    // Right now, it accepts register, but doesn't allow log in.
    var newPassword = document.getElementById('passwordNewUser').value;
    if(newPassword.length<4)
    {
    	alert("password must be between 4-32 characters.");
    	return;
    }
    else if(newPassword.length>32)
    {
    	alert("password must be between 4-32 characters");
	return;
    }

    // Create the url -- Change the urlBase to aws domain
    var url = urlBase + '/create.' + extension;

    // Create json -- the variables in quotes can be changed to a different name but the changes need to be
    // reflected in the php scripts
    var jsonPayload = '{"first" : "' + cleanFirstName + '", "last" : "' + cleanLastName + '", "userNew" : "' + cleanUserName + '", "password": "' + newPassword + '", "email" : "' + cleanEmail + '"}';
    console.log(jsonPayload);

    // Some networking code available in Leineckers slides -- don't really know what it does
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/create.php", true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.send(jsonPayload);

        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                hideOrShow("signUpButton", false);
                document.getElementById('userAddResult').innerHTML = "<br>Account created";

                // Added to automatically login new user
                document.getElementById("loginUser").innerHTML = document.getElementById("newUser");
                document.getElementById("pwUser").innerHTML = document.getElementById("passwordNewUser");
            }
        };

    }
    catch(err)
    {
        // Display error
        document.getElementById("userAddResult").innerHTML =  "<br>User could not be registered. Try again";
    }

    // Hides or displays the form based on boolean passed
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("newUser").value = "";
    document.getElementById("passwordNewUser").value = "";

    hideOrShow("loginForm", false);
    hideOrShow("loggedInDiv", false);
    hideOrShow("createAccount", true);
    hideOrShow("contactList", false);
    hideOrShow("addContactList", false);
}

// Searches for contacts and presents results in a table
function searchContact()
{
    var searchName = document.getElementById("searchContact").value;
    var jsonPayload = '{"search" : "' + searchName + '", "userId" : "' + userID + '"}';
    var url = urlBase + '/search.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/search.php", true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.send(jsonPayload);
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                var res = (xhr.responseText.split("||"));
                console.log("RES.LENGTH IS: " + res.length);

                if(res[0].error == "Contact doesn't exist")
                {
                    var result = document.getElementById('searchContact').value
                    alert(result + " is not on your contact list");
                    return;
                }

                document.getElementById("searchContact").value = "";
                console.log("are we hereeeer searching");
                showResults(res);
                //document.getElementById('contactAddResult').innerHTML = jsonObject.results[0] + " added";
            }
        };

    }
    catch(err)
    {
        document.getElementById('logginResult').innerHTML = err.message;
    }
}

function hideOrShow( elementId, showState )
{
    var vis = "visible";
    var dis = "block";
    if( !showState )
    {
        vis = "hidden";
        dis = "none";
    }

    document.getElementById( elementId ).style.visibility = vis;
    document.getElementById( elementId ).style.display = dis;
}
