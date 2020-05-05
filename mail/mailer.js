const mailer = require("nodemailer")

exports.sendEmail = (email_from, email_to, email_subject, email_content) =>{
	return new Promise( resolve => {
		let transpoter =  mailer.createTransport ({
			service: 'gmail',
			// host : 'smtp.gmail.com',
			// port: 465,
			// secure: true,
			auth: {
				user : "jerrysirah8@gmail.com",
				pass : '4sirah@123'
			}
		})
		//format message
		let message = {
				from : email_from,
				to : email_to,
				subject : email_subject,
				html : email_content
			},
		email_response = ''
		console.log(message)
		//try sending email
		transpoter.sendMail( message, (err, info) => {
			if(err){
				email_response = "Email send failed"
				console.log(err)
				resolve(email_response)
			}
			else{
				email_response = "Email send successfully"
				console.log(info)
				resolve(email_response)
			}
		})
	})
}