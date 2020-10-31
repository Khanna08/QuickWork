const fs = require('fs'); //file system library
const express = require('express'); // express library
const bodyParser = require('body-parser'); // body-parser library
const {google} = require('googleapis'); // Google Rest API

// express object stored in app
const app = express();

// setting ejs as templating engine
app.set('view engine', 'ejs');

// middleware to understand request data
app.use(bodyParser.urlencoded({extended: false}));
// middleware to understand request json
app.use(express.json());


/**
 Scope of gmail access 
 Here we are asking permission to write mails and sending them
 Add more scopes as per user requirement
**/
const SCOPES = [
				'https://www.googleapis.com/auth/gmail.compose', // permission to write
 				'https://www.googleapis.com/auth/gmail.send' // permission to send
 			];

// gmail Oauth cient variable
let oAuth2Client = undefined;

/**
 trying to read credentials.json
 credentials.json is app specific file
 it stores the client id and secrets of app
 which are not accessible to user
**/
fs.readFile('credentials.json', (err, content) => {
	if(err){
		// if credential file not found
		console.log(err);

	}
	else {
		// parsing data from credential.json
		credentials = JSON.parse(content);

		const {client_secret, client_id, redirect_uris} = credentials.installed;

		// declaring Oauth client
		oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[1]);
	}
});

/**
 it s the path to token.json file
 which stores access and refresh tokens
 it is not available initially
 it is created after user allows the app access to certain gmail permissions
**/
const TOKEN_PATH = 'token.json';

// API endpoint to create oAuth client
app.get('/', (req, res) => {

	/**
	 authUrl is created using Scopes passed in oAuth client
	 this defines the permission required
	 it directs to user to allow the app access to its gmail account
	**/
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	/**
	 redirect to the url formed
	 after all permissions are granted the 
	 API automatically serves to /accessCode route
	**/
	res.redirect(authUrl);
});
// API endpoint to store the oAuth client access and refresh tokens
app.get('/accessCode', (req, res) => {

	// this refers to grant code
	code = req.query.code;

	// using grant tokent to get access and refresh tokens
	oAuth2Client.getToken(code, (err, token) => {
		if (err){
			res.send('Error retrieving access token', err);
			console.log(err);
		}
		// store the tokens in a token.json file
		fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
			if (err){
				console.log(err);
			}
		});

		// respond to user 
		res.send('Obtained credentials stored locally');
	});
});

/**
 API end point to send mail
 while requesting this API send a json with
 required data in required format
 {
	'email' : 'recipient email'
	'subject' : 'subject of mail',
	'content' : 'body of mail',
	'choice' : 'send' // if you choose to send mail anyting else to save as draft
 }
**/
app.post('/send', (req, res) => {

	// reading locally stored credentials
	fs.readFile(TOKEN_PATH, (err, token) => {
		if(err){
			res.send('consent to permissions');
		}
		// assign obtained credentials to oAuth client
		oAuth2Client.setCredentials(JSON.parse(token));
	});

	// console.log(oAuth2Client);


	// stores user recieved info
	var {email, subject, content, choice} = req.body;

	// accessing createMail object from javascript file
	var Mail = require('./createMail.js');

	// obj stores mail object wit reuired info
	var obj = new Mail(oAuth2Client, email, subject, content, choice);
	// var obj = new Mail(oAuth2Client, 'akshitkhanna69@gmail.com', 'akkiextreme@gmail.com', 'subject', 'content', 'send');


	// creates mail and chooses to either send or save as per requirement
	obj.makeBody();

});

// this is the port where APIs can be listened
app.listen(3000);
