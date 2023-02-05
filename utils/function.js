var nodemailer = require('nodemailer')
var FCM = require('fcm-node');
var serverKey = 'AAAAeXrI1LM:APA91bEcbbXzzftejpSBVpeIcwqt9cUumHplB_fcKc5adBHFt74ISpSOIEfouPCf0cbugrsrkFmfqbk9R2Ce7vcM0yDQNlW7LQ0iKdZxeTyl5CHLuac5DJ7fVfel0ZhfdojyPUVgfVld';
var fcm = new FCM(serverKey);
// var smtpTransport = require('nodemailer-smtp-transport');


const sendHtmlEmail1 = (email, subject, name, link, callback) => {
        let HTML;
        HTML = `<!DOCTYPE html>
        <html>
        <head>
            <title>Email Verfication</title>
            <link href="https://fonts.googleapis.com/css?family=Poppins:100,200,400,500,600,700,800,900&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0;">
            <div style="font-family: 'Poppins', sans-serif; background-color: #f3f3f3;">
                <div style=" max-width: 600px; margin: auto; width: 100%; padding: 20px 0;">
                    <div style="background-color: #fff; padding: 10px; border: 1px solid #ddd;">
                        <figure style=" margin: -10px -10px 20px; background-color: #6b388e; text-align: center; padding: 15px 0;">
                            <img src="http://mobulous.co.in/Likewise/Logo.png" width="190px">
                        </figure>
                        <h3 style=" background-color: #6b388e; text-align: center; padding: 10px 0; margin: -10px -10px; color: #fff; font-weight: 500; font-size: 20px; display: none;">
                            Welcome to Likewise
                        </h3>
        
                        <h4 style="margin: 0 0 10px; color: #000; font-weight: 600; font-size: 22px;  padding: 0 20px;">
                            Hello, ${name}
                        </h4>
                        <p style=" margin: 0 0 30px; font-size: 15px; color: #545454; font-weight: 500; padding: 0 20px;">
                    Change the password of your LikeWise account
                    </p>
        
                        <figure style="text-align: center;">
                            <img src="http://mobulous.co.in/Likewise/Icon.png" width="190px">
                        </figure>
        
                        <p style="margin: 0 0 20px; text-align: center;">
                            <a href="${link}" target="_blank" style=" background-color: #6b388e; color: #fff; padding: 10px 120px; display: inline-block; border-radius: 5px; text-decoration: none; font-size: 17px; text-transform: capitalize;">
                            Change your password
                            </a>
                        </p>
        
                        <p style="margin: 0 0 10px; text-align: center; font-size: 15px; color: #545454; font-weight: 500;">Or Copy this link and paste in your browser</p>
                        <p style="font-size: 15px; font-weight: 500; text-align: center; margin: 0 0 20px; padding: 0 50px;">
                            <a href="javascript:void(0);" style="word-break: break-all; color: #1076ce; ">
                                ${link}
                            </a>
                        </p>
                    </div>	
        
                    <div style="background-color: #fff; padding: 10px; border: 1px solid #ddd; margin: 20px 0 0 0; text-align: center;">
                        <h4 style="margin: 0 0 10px; color: #000; font-weight: 600; font-size: 22px;  padding: 0;" >
                            Need Help?
                        </h4>
        
                        <h5 style="font-size: 15px; color: #545454; font-weight: 500; margin: 0 0 10px;" >
                        Please send your feedback or bugs report to: support@likewise.chat
                        </h5>
        
                        <h5 style="font-size: 15px; color: #545454; font-weight: 500; margin: 0 0 15px;" >
                            to <a style="" href="mailto:support@likewise.com">support@likewise.com</a>
                        </h5>
    
                    </div>
                </div>
                <div style="clear: both"> </div>
            </div>
        </body>
        </html>`
    
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'noreply.unodogs@gmail.com',
                pass: 'Angel@3011'
            }
        })
        var messageObj = {
            from: 'no-reply<noreply.unodogs@gmail.com>',
            to: email,
            subject: subject,
            text: link,
            html: HTML,
    
        }
        transporter.sendMail(messageObj, (err, info) => {
            if (err) {
                console.log(err);
            } else if (info) {
                console.log(info);
            }
        })
    }
    



exports.sendNotificationForAndroid = (deviceToken, title, body, type, callback) => {
    var message = {
        to: deviceToken,
        notification: {
            title: title,
            body: body,
            sound: 'default',
            type: type
        },
        data: {
            title: title,
            body: body,
            sound: 'default',
            type: type
        }
    };
    fcm.send(message, function (err, response) {
        if (err) {
            return
        } else {
            return;
        }
    })

}

exports.sendHtmlEmail3 = (email, subject, message, callback) => {
    let HTML;
    let welcomeMessage, copyrightMessage, imageLogo;
    imageLogo = "https://cdn.shopify.com/s/files/1/2496/2470/files/logo_footer_a628ee06-516b-47a9-b62e-83feac891172_x200.png?v=1543458982";
    welcomeMessage = 'Welcome to Boushra App'
    copyrightMessage = "© Boushra"
    HTML = `<!DOCTYPE html>
    <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      <meta name="x-apple-disable-message-reformatting">
      <title>Confirm Your Email</title>
      <!--[if mso]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <style>
        table {border-collapse: collapse;}
        .spacer,.divider {mso-line-height-rule:exactly;}
        td,th,div,p,a {font-size: 13px; line-height: 22px;}
        td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family:"Segoe UI",Helvetica,Arial,sans-serif;}
      </style>
      <![endif]-->
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css?family=Lato:300,400,700|Open+Sans');
        table {border-collapse:separate;}
          a, a:link, a:visited {text-decoration: none; color: #00788a;} 
          a:hover {text-decoration: underline;}
          h2,h2 a,h2 a:visited,h3,h3 a,h3 a:visited,h4,h5,h6,.t_cht {color:#000 !important;}
          .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {line-height: 100%;}
          .ExternalClass {width: 100%;}
        @media only screen {
          .col, td, th, div, p {font-family: "Open Sans",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
          .webfont {font-family: "Lato",-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue",Arial,sans-serif;}
        }
    
        img {border: 0; line-height: 100%; vertical-align: middle;}
        #outlook a, .links-inherit-color a {padding: 0; color: inherit;}
    </style>
    </head>
    <body style="box-sizing:border-box;margin:0;padding:0;width:100%;word-break:break-word;-webkit-font-smoothing:antialiased;">
        <div width="100%" style="margin:0; background:#f5f6fa">
            <table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin:0 auto" class="">
                <tbody>
                    <tr style="margin:0;padding:0">
                        <td width="600" height="130" valign="top" class="" style="background-image:url(https://res.cloudinary.com/dnjgq0lig/image/upload/v1546064214/vyymvuxpm6yyoqjhw6qr.jpg);background-repeat:no-repeat;background-position:top center;">
                            <table width="460" height="50" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                </tbody>
                            </table>
                            <table width="460" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                    <tr style="margin:0;padding:0">
                                        <td style="text-align:center; padding: 10px;">
                                            <img src="${imageLogo}" alt="kryptoro" width="100" class="">
                                        </td>
                                    </tr>
                                    <tr bgcolor="#ffffff" style="margin:0;padding:0;text-align:center;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                        <td>
                                            <table width="460" class="" bgcolor="#ffffff" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                                <tbody>
                                                    <tr style="margin:0;padding:0">
                                                        <td bgcolor="#ffffff" height="30" style="text-align:center;background:#ffffff;border-top-left-radius:4px;border-top-right-radius:4px">
                                                        </td>
                                                    </tr>
                                                    <tr style="margin:0;padding:0">
                                                        <td bgcolor="#ffffff" height="100" style="text-align:center;background:#ffffff">
                                                            <img src="https://res.cloudinary.com/dvflctxao/image/upload/v1544705930/wp0z7cswoqigji0whe7n.png" alt="Email register" class="">
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
    
                        </td>
                    </tr>
    
                    <tr>
                        <td>
                            <table width="460" class="" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto">
                                <tbody>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" height="20" style="font-size:0;line-height:0;text-align:center;background:#ffffff">
                                        &nbsp;
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="text-align:center;background:#ffffff">
                                            <p style="margin:0;font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:26px;line-height:26px;color:#272c73!important;font-weight:600;margin-bottom:20px">${welcomeMessage}</p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:14px;line-height:1.5;color:#3a4161;text-align:center;font-weight:300">
                                            <p style="margin:0 30px;color:#3a4161"><h4>${message}</h4></p>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" height="30" style="font-size:0;line-height:0;text-align:center;background:#ffffff">
                                        &nbsp;
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td bgcolor="#ffffff" style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;font-size:17px;font-weight:bold;line-height:20px;color:#ffffff">
                                            <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin:auto">
                                                <tbody>
                                                    <tr style="margin:0;padding:0">
                                                        <td>
                       
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        </td>
                                    </tr>
                                    <tr style="margin:0;padding:0">
                                        <td height="40" bgcolor="#ffffff" style="background:#ffffff;font-size:0;line-height:0;border-bottom-left-radius:4px;border-bottom-right-radius:4px">
                                            &nbsp;
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr style="margin:0;padding:0">
                        <td height="30" style="font-size:0;line-height:0;text-align:center">
                        &nbsp;
                        </td>
                    </tr>
                </tbody>
            </table>
            <table cellspacing="0" cellpadding="0" border="0" align="center" width="600" style="margin:auto" class="">
                <tbody>
    
          <tr style="margin:0;padding:0">
                    <td height="20" style="font-size:0;line-height:0">
                        &nbsp;
                    </td>
                </tr>
    
                <tr style="margin:0;padding:0">
                    <td valign="middle" style="width:100%;font-size:13px;text-align:center;color:#aeb2c6!important" class="m_-638414352698265372m_619938522399521914x-gmail-data-detectors">
                        <p style="font-family:'Open Sans',Open Sans,Verdana,sans-serif;line-height:16px;font-size:13px!important;color:#aeb2c6!important;margin:0 30px">${copyrightMessage}. All rights reserved.</p>
                    </td>
                </tr>
                <tr style="margin:0;padding:0">
                    <td height="20" style="font-size:0;line-height:0">
                        &nbsp;
                    </td>
                </tr>
            </tbody></table>
        </div>
    </body>
    </html>`

    transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'shahzarkhan010@gmail.com',
            pass: '9027140813'
        }
    })
    var messageObj = {
        from: 'No reply<sahjarkhan010@gmail.com>',
        to: email,
        subject: subject,
        html: HTML,

    }
    transporter.sendMail(messageObj, (err, info) => {
        console.log(err);
        console.log(info)
        if (err) {
            console.log(err);
        } else if (info) {
            console.log('Email sent: ' + info);

        }
    })
}

exports.sendChatNotification = (deviceToken, title, body, type, senderId, receiverId, roomId, name, profile, callback) => {
    var message = {
        to: deviceToken,
        notification: {
            title: title,
            body: body,
            sound: 'default',
            type: type,
            senderId: senderId,
            receiverId: receiverId,
            roomId: roomId,
            name: name,
            profile: profile
        },
        data: {
            title: title,
            body: body,
            sound: 'default',
            type: type,
            senderId: senderId,
            receiverId: receiverId,
            roomId: roomId,
            name: name,
            profile: profile
        }
    };
    fcm.send(message, function (err, response) {
        if (err) {
            return
        } else {
            return;
        }
    })
}

module.exports = {
    sendHtmlEmail1

}