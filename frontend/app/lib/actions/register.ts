"use server"

import client from "@/db"
import bcrypt from "bcrypt";

export async function signup(name: string, email: string, password: string) {
    // should add zod validation here
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await client.user.create({
        data: {
            name: name,
            email : email,
            password: hashedPassword
        }
    });

    console.log(user.id);

    return "Signed up!"
    }catch(err){
        console.log(err);
        return "Error while Registeration";
    }
}