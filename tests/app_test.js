import { superoak } from "https://deno.land/x/superoak@4.4.0/mod.ts";
import { app } from "../app.js";
import { assertExists,assertEquals } from "https://deno.land/std@0.113.0/testing/asserts.ts";
import {addQuestion, findAllQuestions, findQuestionById} from "../services/questionService.js";
import { findUserByEmail,findAllUsers} from "../services/userService.js";

Deno.test(
  {
    name: "Get request to '/questions' without being authenticated will be redirected to '/auth/login'",
    fn: async () =>{
      const testClient = await superoak(app);
      await testClient.get("/questions").expect("Redirecting to /auth/login.");
    },
    sanitizeResources: false,
    sanitizeOps: false
}
);

Deno.test(
  {
    name: "Get request to '/quiz' without being authenticated will be redirected to '/auth/login'",
    fn: async () =>{
      const testClient = await superoak(app);
      await testClient.get("/quiz").expect("Redirecting to /auth/login.");
    },
    sanitizeResources: false,
    sanitizeOps: false
}
);

Deno.test(
  {
    name: "Post request to '/auth/register' with password of length 3 will not create a user in the database",
    fn: async () =>{
      const testClient = await superoak(app);
      await testClient.post("/auth/register").send("email=shortpassword@gmail.com").send("password=0");
      const user = await findUserByEmail("shortpassword@gmail.com");
      assertEquals(user,undefined);
    },
    sanitizeResources: false,
    sanitizeOps: false
}
);

Deno.test(
  {
    name: "Post request to '/auth/login' with correct password and email will be successful and the user will be redirected to /questions",
    fn: async () =>{
      const users = await findAllUsers();
      const num = users.length;
      const testClient = await superoak(app);
      await testClient.post("/auth/login").send(`email=${num}@gmail.com`).send("password=012345")
      .expect("Redirecting to /questions.");
    },
    sanitizeResources: false,
    sanitizeOps: false
}
);
 
Deno.test(
  {
    name: "Post request to '/questions/:id/delete' without being authenticated as the creater of the question will not delete the question",
    fn: async () =>{
      const users = await findAllUsers();
      const user = users[users.length-1];
      await addQuestion(user.id,"multiplication","2*2=?");
      const questions = await findAllQuestions();
      const question = questions[questions.length-1];
      const testClient = await superoak(app);
      await testClient.post("/questions/${question.id}/delete");
      const res = await findQuestionById(question.id);
      assertExists(res);
    },
    sanitizeResources: false,
    sanitizeOps: false
}
);
