"use client";
// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import { connectToDB } from "../../../../utils/db";
import User from "../../../../models/user";
import GoogleProvider from "next-auth/providers/google";
import {
  getAuth,
  initializeFirebaseAdmin,
} from "../../../../utils/firebase-admin";

initializeFirebaseAdmin(); // Ensure Firebase is initialized

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      try {
        await connectToDB();
        const sessionUser = await User.findOne({ email: session.user?.email });
        if (sessionUser) {
          if (session.user) {
            session.user.id = sessionUser._id.toString();
            session.user.token = token.sub;
          }
        }
        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return Promise.resolve(session);
      }
    },
    async signIn({ user }) {
      try {
        await connectToDB();
        const userExists = await User.findOne({ email: user.email });
        if (!userExists) {
          await User.create({
            email: user.email,
            username: user.name.replace(/\s/g, "").toLowerCase(),
            image: user.image,
          });
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
