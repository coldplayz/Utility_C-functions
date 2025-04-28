
import { Request, Response } from "express";
import cors from "cors";

/**
 * Check if origin is allowed using cors
 * if it allowed called next
 * else failed and prevent next middleware from running
 */

/**
 * The @matchCors uses regular expression to compare
 * @param CORS_URL value in process.env
 * it allow server-to-server communication
 * it allow rest-tools communication
 * it allow specified origins  
 */
function matchCors(str: string) {
    const corsURL = process.env.CORS_URL || "";
    const parts = corsURL.split(',');
    const regexps = parts.map(part => new RegExp(`\\b${part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
    return regexps.some(regex => regex.test(str));
}

const corsOptions = {
    origin: function (origin: any, callback: any) {
        if (matchCors(origin) || !origin)
            callback(null, true)
        else
            callback(new Error("cors blocked").message);
    },
    method: ["POST"]
}

const filterCors = cors(corsOptions);

const corsResponse = (req: Request, res: Response) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type,JWT, Authtoken');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
}

export { filterCors, corsResponse };




