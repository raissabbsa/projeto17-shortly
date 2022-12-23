import connection from "../database/db.js";

export async function getUSer(req, res){
    const session = res.locals.existSession.rows[0];
    let urlArray = [];
    let totalVisits = 0;
    try{
        const existUser = await connection.query(`
            SELECT * FROM users WHERE id = $1`, [session.userId]);
        if(existUser.rows.length === 0){
            return res.sendStatus(404);
        }
        const user = existUser.rows[0];
        delete user.password;
        delete user.email;

        const urls = await connection.query(`
            SELECT * FROM urls WHERE "userId" = $1 ORDER BY id`, [session.userId]);
        
        for(let i=0; i< urls.rows.length; i++){
            const url = urls.rows[i];
            delete url.userId;
            urlArray.push(url);
            totalVisits += urls.rows[i].visitCount;
        }
        
        const answer = {
            ...user,
            visitCount: totalVisits,
            shortenedUrls: urlArray
        }
        res.status(200).send(answer);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}