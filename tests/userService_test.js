import {assertExists,assert} from "https://deno.land/std@0.113.0/testing/asserts.ts";
import { bcrypt } from "../deps.js";
import { findUserByEmail, findUserById,addUser,findAllUsers } from "../services/userService.js";
let id=-1;
Deno.test(
  {
    name: "Calling addUser(email='${numberOfUsers+1}@gmail.com',password='012345') creates a user)",
    fn: async () =>{
      const users = await findAllUsers();
      const num = users.length;
      const email = `${num+1}@gmail.com`;
      const password = "012345";
      const hash = await bcrypt.hash(password);
      await addUser(email,hash);
      const user = await findUserByEmail(email);
      assertExists(user);
    },
    sanitizeResources: false,
    sanitizeOps: false
}
);

Deno.test({
  name: "Calling findUserByEmail(`${num}@gmail.com`) finds the user we just created",
  fn: async () =>{
    const users = await findAllUsers();
    const num = users.length;
    const email = `${num}@gmail.com`;
    const user = await findUserByEmail(email);
    id=user.id;
    assertExists(user);
    const passwordIsCorrect = await bcrypt.compare("012345",user.password);
    assert(passwordIsCorrect);
  },
  sanitizeResources: false,
  sanitizeOps: false
});

Deno.test({
  name: "Calling findUserById(id) finds the user we just created",
  fn: async () =>{
    const user = await findUserById(id);
    assertExists(user)
    },
  sanitizeResources: false,
  sanitizeOps: false
});



