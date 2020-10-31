const fs = require('fs'); //file system library
const express = require('express'); // express library
const bodyParser = require('body-parser') // body-parser library
const {google} = require('googleapis'); // Google Rest API

// express object stored in app
const app = express();

// setting ejs as templating engine
app.set('view engine', 'ejs');

// used to understand request data
app.use(bodyParser.urlencoded({extended: false}));


/**
 Scope of gmail access 
 Here we are asking permission to write mails and sending them
 Add more scopes as per user requirement
**/
const SCOPES = [ 
				'https://www.googleapis.com/auth/gmail.compose',
				'https://www.googleapis.com/auth/gmail.send'
			];

// gmail Oauth cient variable
let oAuth2Client = undefined;

// route to token (initially not available)
const TOKEN_PATH = 'token.json';
 
// server route for home page
// app.get('/', (req, res) => {
// 	res.render('index');
// });

// route to Obtain gmail users credentials
app.get('/', (req, res) => {
	// reading credential file which should be present beforehand
	fs.readFile('credentials.json', (err, content) => {
		if(err){
			// if credential file not found
			res.send('Error loading client secret file:');
			console.log(err);
		}
		else {
			// parsing data from credential.json
			credentials = JSON.parse(content);

			const {client_secret, client_id, redirect_uris} = credentials.installed;

			// creating Oauth client
			oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
			
			// trying to read token.json
			fs.readFile(TOKEN_PATH, (err, token) => {
				if(err){

					// if tokens not initially present then user will be asked to do these steps
					const authUrl = oAuth2Client.generateAuthUrl({
						access_type: 'offline',
						scope: SCOPES,
					});
					// granting access
					res.redirect(authUrl)
				}
				else{
					// creating Oauth client with user credentials
					oAuth2Client.setCredentials(JSON.parse(token));
					
					// sending mail template
					res.render('compose');
				}
			});
		}
	});
});

// extra step if token not initially available
app.get('/accessCode/:code', (req, res) => {

	// code = req.params.code;
	console.log(req.params);

	// user access grant code
	// code = req.body.code;

	oAuth2Client.getToken(code, (err, token) => {
		if (err){
			res.send('Error retrieving access token', err);
			console.log(err);
		}

		// creating Oauth client with user credentials
		oAuth2Client.setCredentials(token);
		
		// Store the token to disk for later program executions
		fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
			if (err){
				console.log(err);
			}
		});
	});
	// sending mail template
	// res.render('compose');
});

// result page
app.get('/send', (req, res) => {

	// console.log(oAuth2Client);

	// stores user recieved info
	// var {Smail, Rmail, subject, content, choice} = req.body;

	// accessing create mail library
	var Mail = require('./createMail.js');

	// var obj = new Mail(oAuth2Client, Smail, Rmail, subject, content, choice);
	var obj = new Mail(oAuth2Client, 'akshitkhanna69@gmail.com', 'akkiextreme@gmail.com', 'subject', 'content', 'send');


    obj.makeBody();

});

app.listen(3000);