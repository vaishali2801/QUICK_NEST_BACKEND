
import auditLog from "../model/auditLog.js";

const auditLogger = async({action,performedBy,module,targetedId,Ip,userAgent})=>{
    try {
        await auditLog.create({
            action,
            performedBy,
            module,
            targetedId,
            Ip,
            userAgent
        })    
    } catch (error) {
        console.log(error.message);
    }
}
export default auditLogger;