import NextAuth from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'email', type: 'text', placeholder: '' },
          password: { label: 'password', type: 'password', placeholder: '' },
        },
        //@typescript-eslint/no-unused-vars
        async authorize(credentials: Record<"email" | "password" , string> | undefined) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please provide both email and password')
          }

          return {
            id : "user1"
          }
        //   try {
        //     // Make API call to your backend to validate credentials
        //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        //       method: 'POST',
        //       headers: {
        //         'Content-Type': 'application/json',
        //       },
        //       body: JSON.stringify({
        //         email: credentials.username,
        //         password: credentials.password,
        //       }),
        //     })

        //     const user = await response.json()

        //     if (response.ok && user) {
        //       return user
        //     }

        //     return null
        //   } catch (error) {
        //     console.error('Auth error:', error)
        //     throw new Error('Authentication failed')
        //   }
        },
      })
  ],
  secret: process.env.NEXTAUTH_SECRET || "SEC3RT",
  pages: {
    signIn : '/login'
  }
})

export { handler as GET, handler as POST }