
import clients from "../config/twilio.js";

const sendWhatsAppMessage = async(to,body)=>{
    try {
        const message = await clients.messages.create({
            from:"whatsapp:+14155238886",
            to:`whatsapp:+91${to}`,
            body
        })
        console.log("whatsapp id:",message.id);
    } catch (error) {
        console.log(error.message);
    }
}
export default sendWhatsAppMessage;