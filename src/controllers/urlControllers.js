import { urlSchema } from "../models/urlModels.js";
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

        const userId = res.locals.existSession.rows[0].userId;

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

export async function geturlsId(req, res){
    const id = req.params.id;
    try{
        const existUrl = await connection.query(`
            SELECT * FROM urls WHERE id = $1`,[id]);
        if(existUrl.rows.length === 0){
            return res.sendStatus(404);
        }
        const {shortUrl, url} = existUrl.rows[0];

        res.status(200).send({id, shortUrl, url});
         
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function geturlsOpen(req, res){
    const shortUrl = req.params.shortUrl;
    try{
        const existUrl = await connection.query(`
            SELECT * FROM urls WHERE "shortUrl" = $1`,[shortUrl]);
        if(existUrl.rows.length === 0){
            return res.sendStatus(404);
        }
        const {url, visitCount} = existUrl.rows[0];

        await connection.query(`
            UPDATE urls SET "visitCount" = $1 WHERE "shortUrl" = $2`, 
            [visitCount +1, shortUrl]);
        res.status(200).redirect(url);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function deleteurl(req, res){
    const id = req.params.id;
    const session = res.locals.existSession.rows[0];

    try{
        const infoUrl = await connection.query(`SELECT * FROM urls WHERE id = $1`, [id]);

        if(infoUrl.rows.length === 0){
            return res.sendStatus(404);
        }

        if(infoUrl.rows[0].userId !== session.userId){
            return res.sendStatus(401);
        }
        await connection.query(`DELETE FROM urls WHERE id = $1`, [id]);

        res.sendStatus(204);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }   
}