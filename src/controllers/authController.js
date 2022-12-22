import connection from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid"

export async function signup(req,res){  
    const {name, email, password} = req.body;
    
    try{
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
    const {email} = req.body
    try{
        const isUser = await connection.query(`SELECT * FROM users WHERE email = $1`, [email]);

        const token = uuidV4();
        
        await connection.query(`
            INSERT INTO sessions ("userId", token) VALUES ($1, $2)`, 
            [isUser.rows[0].id, token]);
        res.status(200).send(token);

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}