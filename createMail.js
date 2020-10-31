const {google} = require('googleapis');
const mailComposer = require('nodemailer/lib/mail-composer'); // nodemailer library
	
class CreateMail{

	constructor(auth, me, to, sub, body, task){
		this.me = me;
		this.task = task;
		this.auth = auth;
		this.to = to;
		this.sub = sub;
		this.body = body;
		this.gmail = google.gmail({version: 'v1', auth});
		console.log(this.gmail);
	}

	//Creates the mail body and encodes it to base64 format.
	makeBody(){
		let mail;
		let status;
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
			
			if(this.task === 'send'){
				console.log('sending data');
				this.sendMail(encodedMessage);
			}
			this.saveDraft(encodedMessage);
		});
	}

	//Send the message to specified receiver.
	sendMail(encodedMessage){
		this.gmail.users.messages.send({
			userId: this.me,
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
module.exports = CreateMail;