import transporter from "../config/email.js";
// import HttpError from "../middleware/HttpError.js";


const sendEmail = async({to,subject,html})=>{
    try {
        const info = await transporter.sendMail({
            from: '"QuickNest" <vaishalichauhan2801@gmail.com>',
            to,
            subject,
            html
        })
        console.log("email set id: ",info.messageId);
    } catch (error) {
        console.log(error.message); 
    }
}
export default sendEmail;