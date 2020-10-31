<h2>Quickwork Internship Task</h3>

<p>
    The flow of the program is as follows : -
</p>

<br>

<h3>Start Server</h3>

<p>
    Open Terminal, navigate to your repository and use command 'node app'
</p>

<br>

<h3>Open API endpoint to obtain oAuth cpent</h3>
<p>
    <ul>
        <p>Open localhost:3000 on browser</p>
        <p>sign in to your account</p>
        <p>gmail will ask you for permissions</p>
        <p>accept all of them</p>
        <p>the app would store the oAuth credentials locally</p>
        <p>and respond to user with following message if successful 'Obtained credentials stored locally'</p>
    </ul>
</p>

<h3>Open API endpoint to send mails</h3>
<p>
    <ul>
        <p>send an post request to localhost:3000/send</p>
        <p>pass a json with following format</p>
        <p>
          <ul>
            <p>{ </p>
            <p>'email' : 'recipient email',</p>
            <p>'subject' : 'subject of mail',</p>
            <p>'content' : 'body of mail',</p>
            <p>'choice' : 'send' // if you choose to send mail anyting else to save as draft</p>
            <p>}</p>
            <p>the mail would be sent with an acknowledgement recieved on the console</p>
          </ul>
        </p>
    </ul>
</p>
