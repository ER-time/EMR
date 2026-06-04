import axios from "axios";
import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const loginResp = await fetch("https://medicalaiapi.xeventechnologies.com/api/account/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              emailAddress: credentials?.email,
              password: credentials?.password,
            }),
          });
          const loginData = await loginResp.json();

          if (loginData?.succeeded) {
            return {
              success: true,
              message: "Authentication successful",
              user: {
                email: credentials?.email,
                userId: loginData?.data?.userId || null,
                name: loginData?.data?.name || credentials?.email,
                roleId: loginData?.data?.roleId || 3,
                token: loginData?.data?.token || "bypassed",
              },
            };
          }
          return null;
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }

        // if (
        //   !credentials ||
        //   !credentials.email ||
        //   !credentials.password ||
        //   !credentials.otpCode
        // ) {
        //   return null;
        // }

        // const users = [
        //   {
        //     id: 1,
        //     email: "admin@user.com",
        //     password: "123456aA@",
        //     name: "Muhammad Usman",
        //     role: "ADMIN",
        //     roleName: "Admin",
        //   },
        //   {
        //     id: 2,
        //     email: "doctor@user.com",
        //     password: "123456aA@",
        //     name: "Muhammad Usman",
        //     role: "DOCTOR",
        //     roleName: "Doctor",
        //   },
        //   {
        //     id: 3,
        //     email: "patient@user.com",
        //     password: "123456aA@",
        //     name: "Muhammad Usman",
        //     role: "PATIENT",
        //     roleName: "Patient",
        //   },
        // ];

        // const foundUser = users.find((user) => {
        //   return (
        //     user.email === credentials.email &&
        //     user.password === credentials.password
        //   );
        // });

        // if (foundUser) {
        //   const customResponse = {
        //     success: true,
        //     message: "Authentication successful",
        //     foundUser,
        //   };

        //   return customResponse;
        // } else return null;
        // return null;
      },
    }),
  ],
  // callbacks: {
  //   jwt: async ({ token, user }) => {
  //     user && (token.user = user);
  //     return token;
  //   },
  //   session: async ({ session, token }) => {
  //     session.user = token.user;
  //     return session;
  //   },
  // },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session?.data };
      }
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      console.log("session:::>>>>>>>", session);
      session.user = token;

      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// module.exports = { options };
