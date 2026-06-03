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
        console.log("credentials", credentials);

        try {
          // Your API call code here
          const response = await fetch(
            `https://medicalaiapi.xeventechnologies.com/api/registration/verifyOTPCode?email=${credentials?.email}&code=${credentials?.otpCode}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: null,
            }
          );

          const user = await response.json();
          console.log("API Response:", user); // Log the response data
          if (user) {
            const customResponse = {
              success: true,
              message: "Authentication successful",
              user: {
                ...user?.data,
              },
            };

            console.log("customResponse", customResponse);

            return customResponse;
          } else return null;
          return null;
        } catch (error) {
          console.error("API Error:", error);
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
