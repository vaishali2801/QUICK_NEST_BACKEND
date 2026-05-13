import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
    windowMs:15*60*1000,
    limit:500,
    message:"too many request from this ip,plz try again later after 15 min"
});

export const authLimiter = rateLimit({
    windowMs:15*60*1000,
    limit:50,
    message:"too many request from this ip,plz try again later after 15 min"
});

