import { executeQuery } from "../database/database.js";
import {checkQueryResult} from "../utils/utils.js";

const findOptionById = async (id)=>{
  const res = await executeQuery("SELECT * FROM question_answer_options WHERE id = $1;",id)
  const rows = checkQueryResult(res);
  if (rows.length==1){
    return rows[0];
  }
  return;
};

const findOptionByQuestionId = async (id)=>{
  const res = await executeQuery("SELECT * FROM question_answer_options WHERE question_id = $1;",id)
  const options = checkQueryResult(res);
  return options;
};

const addOption = async (question_id,option_text,is_correct) =>{
   await executeQuery("INSERT INTO question_answer_options (question_id,option_text,is_correct) VALUES ($1, $2, $3);",
   question_id,
   option_text,
   is_correct
  );
};

const deleteOption = async (question_id,option_id) =>{
  const res = await executeQuery("DELETE FROM question_answer_options WHERE question_id = $1 AND id = $2;",
  question_id, option_id
  );
  return res;
};

export { addOption,findOptionById,findOptionByQuestionId,deleteOption };
