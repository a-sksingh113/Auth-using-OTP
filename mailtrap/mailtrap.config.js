
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();
 export const mailtrapClient = new MailtrapClient({
  endpoint : process.env.MAILTRAP_ENDPOINT,
    token: process.env.MAILTRAP_TOKEN,
});
 export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Satish_Kumar_Singh",
};

//  export const recipients = [
//     {
//       email: "i.sksingh113@gmail.com",
//     }
//   ];