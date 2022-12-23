import connection from "../database/db.js";

export async function getUser(req, res){
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
        delete user.createdAt;

        const urls = await connection.query(`
            SELECT * FROM urls WHERE "userId" = $1 ORDER BY id`, [session.userId]);
        
        for(let i=0; i< urls.rows.length; i++){
            const url = urls.rows[i];
            delete url.userId;
            delete url.createdAt;

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

export async function getRanking(req, res){
    try{
         const answer = await connection.query(`
            SELECT users.id,
                users.name,
                COUNT(urls.*) AS "linksCount",
                SUM(urls."visitCount") AS "visitCount"
            FROM users LEFT JOIN urls ON urls."userId" = users.id
            GROUP BY users.id
            ORDER BY "visitCount" DESC
            LIMIT 10
         `);

         for(let i=0; i < answer.rows.length; i++){
            if(answer.rows[i].visitCount === null){
                answer.rows[i].visitCount = "0";
            }
         }
         res.status(200).send(answer.rows);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}