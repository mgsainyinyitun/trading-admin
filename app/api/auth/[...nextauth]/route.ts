// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Check if credentials are provided
                if (!credentials) {
                    throw new Error("Credentials are required");
                }

                // Find the admin by email
                const admin = await prisma.admin.findUnique({
                    where: { email: credentials.email },
                });

                if (!admin) {
                    throw new Error("No admin found with this email");
                }

                // Compare the provided password with the hashed password in the database
                const isValid = await bcrypt.compare(
                    credentials.password,
                    admin.password
                );

                // const isValid = credentials.password === admin.password;

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                // Return the admin object (ensure id is a string)
                return {
                    id: admin.id.toString(),  // Ensure id is always a string
                    email: admin.email,
                    name: admin.name,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            console.log("Session Callback - Session:", session);
            console.log("Session Callback - Token:", token);
            if (token) {
                session.user = {
                    id: token.sub || null,
                    email: token.email || null,
                    name: token.name || null,
                };
            }
            return session;
        },
        async jwt({ token, account }) {
            console.log("JWT Callback - Token:", token);
            console.log("JWT Callback - Account:", account);
            if (account) {
                token.sub = account.id as string;
                token.email = account.email as string;
                token.name = account.name as string;
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    cookies: {
        sessionToken: {
            name: "next-auth.session-token",
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Use secure cookies in production
                sameSite: "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60, // Match session maxAge
            },
        },
    },
    jwt: {
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    pages: {
        signIn: "/login", // Custom sign-in page
    },
});

export { handler as GET, handler as POST };


// app/components/SignOut.js
// "use client"; // This is a client component
// import { signOut } from "next-auth/react";

// export default function SignOut() {
//   return (
//     <div>
//       <button onClick={() => signOut()}>Sign out</button>
//     </div>
//   );
// }