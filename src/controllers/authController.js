import connection from "../database/db.js";
import { userSchema } from "../middlewares/userModel.js";

export async function signup(req,res){
    const user = req.body;
    const {name, email, password} = req.body;

    const {error} = userSchema.validate(user, { abortEarly: false });
    if(error){
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors)
    }
    try{
        const emailExists = await connection.query(`SELECT * FROM users WHERE email=$1`, [user.email]);
        if(emailExists){
            return res.sendStatus(409);
        }
        await connection.query(`
            INSERT INTO users (name, email, password) VALUES ($1, $2, &3)`,
            [name, email, password]);
        res.sendStatus(201);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}