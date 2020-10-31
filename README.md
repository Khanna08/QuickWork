# QuickWork
Send Email Task

The flow of the program is as follows : -
1)  Start server
2)  Open localhost:3000 on browser to reach API endpoint to obtain oAuth client
    which would ask for permissions for writing and sending mails
    accept all of them
    the app would redirect itself automatically and store the oAuth credentials locally
    and respond to user with following message if successful 'Obtained credentials stored locally'
3)  now send an post request to localhost:3000/send
    this is the API endpoint to send mails
    the post request should have the request body with following format
    a json 
    {
      'email' : 'recipient email',
      'subject' : 'subject of mail',
      'content' : 'body of mail',
      'choice' : 'send' // if you choose to send mail anyting else to save as draft
    }
    the mail would be sent with an acknowledgement recieved on the console
