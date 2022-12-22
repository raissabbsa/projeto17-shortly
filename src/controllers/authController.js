import connection from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid"
import { userSchema, loginSchema } from "../middlewares/userModel.js";

export async function signup(req,res){
    const user = req.body;
    const {name, email, password} = req.body;

    const {error} = userSchema.validate(user, { abortEarly: false });
    if(error){
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }
    try{
        const emailExists = await connection.query(`SELECT * FROM users WHERE email=$1`, [user.email]);
        if(emailExists.rows.length > 0){
            return res.sendStatus(409);
        }
        const hashPassword = bcrypt.hashSync(password, 10);
        await connection.query(`
            INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`,
            [name, email, hashPassword]);
        res.sendStatus(201);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export async function signin(req,res){
    const {email, password} = req.body;
    const {error} = loginSchema.validate({email, password}, { abortEarly: false });
    if(error){
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try{
        const isUser = await connection.query(`SELECT * FROM users WHERE email = $1`, [email]);

        if(isUser.rows.length === 0){
            return res.sendStatus(401);
        }
        const isPassword = bcrypt.compare(password, isUser.rows[0].password);
        if(!isPassword){
            return res.sendStatus(401);
        }
        const token = uuidV4();
        
        await connection.query(`
            INSERT INTO sessions ("userId", token) VALUES ($1, $2)`, 
            [isUser.rows[0].id, token]);
        return res.status(200).send(token);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}