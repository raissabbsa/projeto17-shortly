import connection from "../database/db.js";

export async function posturlValidation(req, res, next){
    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer", "");

    if(!token){
        return res.sendStatus(401);
    }

    try{
        const existSession = await connection.query(`
            SELECT * FROM sessions WHERE token = $1`, [token]);
        if(existSession.rows.length === 0){
            return res.sendStatus(401);
        }
        res.locals.existSession = existSession;


    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }

    next();
}