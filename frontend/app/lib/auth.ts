import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import client from "@/db"

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            email: { label: 'email', type: 'text', placeholder: '' },
            password: { label: 'password', type: 'password', placeholder: '' },
          },
          //@typescript-eslint/no-unused-vars
          async authorize(credentials: Record<"email" | "password", string> | undefined) {
            if (!credentials?.email || !credentials?.password) {
              return null;
            }

            const existingUser = await client.user.findFirst({
                where: {
                    email: credentials.email
                }
            });
            
            if (existingUser) {
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password) || credentials.password == existingUser.password;
                if (passwordValidation) {
                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        email: existingUser.email
                    }
                }
            }
            return null;
          },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET || "SEC3RT",
    pages: {
      signIn : '/login'
    }
  }