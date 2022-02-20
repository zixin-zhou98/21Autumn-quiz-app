import { executeQuery } from "../database/database.js";
import {checkQueryResult} from "../utils/utils.js";

const findQuestionsByUser = async (user_id) =>{
  const res=await executeQuery("SELECT * FROM questions WHERE user_id = $1;",user_id);
  return checkQueryResult(res);
};

const findQuestionById = async (id)=>{
  const res = await executeQuery("SELECT * FROM questions WHERE id = $1;",id);
  const rows = checkQueryResult(res);
  if (rows.length>0){
    return rows[0];
  }
  return;
};

const addQuestion = async (user_id,title,question_text) =>{
   await executeQuery("INSERT INTO questions (user_id,title,question_text) VALUES ($1, $2, $3);",
   user_id,
   title,
   question_text
  );
};

const deleteQuestion = async (question_id) =>{
  const res = await executeQuery("DELETE FROM questions WHERE id = $1;",
  question_id
  );
  return res;
};

const findAllQuestions = async () =>{
  const res = await executeQuery ("SELECT * FROM questions;")
  return checkQueryResult(res);
};

const generateRandomQuestionId = async () => {
  const questions = await findAllQuestions();
  if (questions.length==0){
      return;
  }
  else {
      const range = questions.length;
      const index = Math.floor(Math.random() * range);
      const question = questions[index];
      return question.id;
  }
};

export { addQuestion,findQuestionsByUser,findQuestionById,deleteQuestion, findAllQuestions,generateRandomQuestionId };
