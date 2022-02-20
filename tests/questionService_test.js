import { assertEquals } from "https://deno.land/std@0.113.0/testing/asserts.ts";
import {findQuestionById, deleteQuestion, findAllQuestions} from "../services/questionService.js";

Deno.test(
  {
    name: "Calling deleteQuestion(question.id) will delete the question (after deletion, the question cannot be found)",
    fn: async () =>{
      const questions = await findAllQuestions();
      const question = questions[questions.length-1];
      await deleteQuestion(question.id);
      const res = await findQuestionById(question.id);
    assertEquals(res,undefined);
    },
    sanitizeResources: false,
    sanitizeOps: false
}
);
