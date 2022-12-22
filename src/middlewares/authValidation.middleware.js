import connection from "../database/db.js";
import { userSchema, loginSchema } from "../models/authModels.js";
import bcrypt from "bcrypt";

export async function signupValidation(req, res, next){
    const user = req.body;

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
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
    next();
}

export async function signinValidation(req, res, next){
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

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }

    next();
}