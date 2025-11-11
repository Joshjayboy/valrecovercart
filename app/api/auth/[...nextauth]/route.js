// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
// import User from "@/models/User";
// import { dbConnect } from "@/lib/dbConnect";

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await dbConnect();

//         // ✅ Always lowercase emails
//         const email = credentials.email.trim().toLowerCase();
//          const password = credentials.password;

//          console.log("🟢 Login attempt for:", email);
//          console.log("🟢 Login attempt for:", password);

//         // 🔍 Find user
//         const user = await User.findOne({ email });
//         if (!user) {
//           console.log("❌ No user found for email:", email);
//           return null;
//         }

//          const isValid = await bcrypt.compare(password, user.password);
//   console.log("🔑 Password match:", isValid);

//   if (!isValid) {
//     console.log("❌ Invalid password for:", email);
//     return null;
//   }

//         console.log("✅ Login successful for:", email);
//         return { id: user._id.toString(), email: user.email };
//       },
//     }),
//   ],

//   pages: {
//     signIn: "/login",
//   },

//   session: {
//     strategy: "jwt",
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };




import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

         console.log("🟢 Attempting login for:", email);

        const user = await User.findOne({ email });
          if (!user) {
    console.log("❌ User not found");
    return null;
  }


   console.log("🔐 Stored hash:", user.password);
  console.log("🔐 Entered password:", password);

        const isValid = await bcrypt.compare(password, user.password);
        console.log("🔑 Password match:", isValid);


          if (!isValid) {
    console.log("❌ Invalid password");
    return null;
  }

   console.log("✅ Login successful!");

        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
  ],

  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
