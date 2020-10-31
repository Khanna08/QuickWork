const {google} = require('googleapis'); // google rest API
const mailComposer = require('nodemailer/lib/mail-composer'); // nodemailer library

// custom class for executing mail options
class CreateMail{

	/**
	 auth is used for oAuth 2.0 client
	 to stores email address of recipient
	 sub stors the subject
	 body is used to store text body of the mail(only text option in this app)
	 if value of task is 'send' then mail is sent otherwise it is saved as draft
	**/
	constructor(auth, to, sub, body, task){
		this.task = task;
		this.auth = auth;
		this.to = to;
		this.sub = sub;
		this.body = body;

		// this stores the current user gmail credentials
		this.gmail = google.gmail({version: 'v1', auth});
		// console.log(this.gmail);
	}

	//Creates the mail body and encodes it to base64 format.
	makeBody(){

		// an object for mail
		let mail;
		mail = new mailComposer({
			to: this.to,
			text: this.body,
			subject: this.sub,
			textEncoding: "base64"
		});
		//Compiles and encodes the mail.
		mail.compile().build((err, msg) => {
			if (err){
				return console.log('Error compiling email ' + error);
			} 
			const encodedMessage = Buffer.from(msg)
			  .toString('base64')
			  .replace(/\+/g, '-')
			  .replace(/\//g, '_')
			  .replace(/=+$/, '');
			
			// task is user specified
			if(this.task === 'send'){
				this.sendMail(encodedMessage);
			}
			this.saveDraft(encodedMessage);
		});
	}

	//Send the message to specified receiver.
	sendMail(encodedMessage){
		this.gmail.users.messages.send({
			userId: "me",
			resource: {
				raw: encodedMessage,
			}
		}, (err, result) => {
			if(err){
				return console.log('NODEMAILER - The API returned an error: ' + err);
			}
				
			console.log("NODEMAILER - Sending email reply from server:", result.data);
		});
	}

	//Saves the draft.
	saveDraft(encodedMessage){
		this.gmail.users.drafts.create({
			'userId': this.me,
			'resource': {
				'message': {
					'raw': encodedMessage 
				}
			}
		})
	}

}
// making createmail available for the repository
module.exports = CreateMail;
