import { urlSchema } from "../models/userModels.js";
import { nanoid } from 'nanoid'
import connection from "../database/db.js";


export async function posturl(req, res){
    const {url} = req.body;

    const {error} = urlSchema.validate({url}, { abortEarly: false });

    if(error){
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }
    try{
        const shortUrl = nanoid();

        const userId = res.locals.existSession.rows[0].userId

        await connection.query(`
            INSERT INTO urls ("shortUrl", url, "userId", "visitCount")
            VALUES ($1, $2, $3, $4)`,
            [shortUrl, url, userId, 0]);

        res.status(201).send({shortUrl});
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}