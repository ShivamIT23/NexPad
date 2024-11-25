"use server"

import client from "@/db"

export async function signup(name: string, email: string, password: string) {
    // should add zod validation here
    try{
        const user = await client.user.create({
        data: {
            name: name,
            email : email,
            password: password
        }
    });

    console.log(user.id);

    return "Signed up!"
    }catch(err){
        console.log(err);
        return "Error while Registeration";
    }
}