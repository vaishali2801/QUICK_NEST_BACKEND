
// import {createClient} from "redis";

// const redisClient = createClient({
//     url: process.env.REDIS_URL || "redis://localhost:6379",
// });

// redisClient.on("error",(error)=>console.log(error));

// await redisClient.connect();
// export default redisClient;
import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (error) => {
    console.log("Redis Error:", error);
});

(async () => {
    try {
        await redisClient.connect();
        console.log("Redis Connected");
    } catch (error) {
        console.log("Redis Connection Failed");
    }
})();

export default redisClient;