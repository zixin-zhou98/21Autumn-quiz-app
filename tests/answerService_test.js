import {assertEquals} from "https://deno.land/std@0.113.0/testing/asserts.ts";
import { getNumberOfAnswers } from "../services/answerService.js";
import { findAllUsers } from "../services/userService.js";
Deno.test({
  name: "Calling getNumberOfAnswers(id), return the correct number of questions answered by the user",
  fn: async () =>{
    const users = await findAllUsers();
    const user = users[users.length-1];
    const num = await getNumberOfAnswers(user.id);
    assertEquals(Number(num),0);
  },
  sanitizeResources: false,
  sanitizeOps: false
});


