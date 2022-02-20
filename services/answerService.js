import { executeQuery } from "../database/database.js";
import {checkQueryResult} from "../utils/utils.js";

const addAnswer = async (userId, questionId, optionId,correct) => {
    await executeQuery("INSERT INTO question_answers (user_id,question_id,question_answer_option_id,correct) VALUES ($1, $2, $3, $4);",
    userId,
    questionId,
    optionId,
    correct
    );
};

const deleteAnswerByOptionId = async (optionId) => {
    await executeQuery("DELETE FROM question_answers WHERE question_answer_option_id = $1;",
    optionId
    );
};

const getNumberOfAnswers = async (userId) => {
    const res = await executeQuery("SELECT COUNT(*) FROM question_answers WHERE user_id = $1;",
    userId
    );
    const num = checkQueryResult(res)[0];
    return num.count;
};

const getNumberOfCorrectAnswers = async (userId) => {
    const res = await executeQuery("SELECT COUNT(*) FROM question_answers WHERE user_id = $1 AND correct = true;",
    userId
    );
    const num = checkQueryResult(res)[0];
    return num.count;
};

const getNumberOfAnswersByUser = async (userId) => {
    const questionRes = await executeQuery("SELECT * FROM questions WHERE user_id = $1;",userId);
    const questions = checkQueryResult(questionRes);
    let sum = 0;
    for (let question of questions){
        const res = await executeQuery("SELECT COUNT(*) FROM question_answers WHERE question_id = $1;",question.id);
        const num = checkQueryResult(res)[0];
        sum = sum + Number(num.count);
    }
    return sum;
};

const getUsersWithMostAnswers = async () => {
    const res = await executeQuery(
        "SELECT user_id,COUNT(*) FROM question_answers GROUP BY user_id ORDER BY COUNT(*) DESC;");
    const rows = checkQueryResult(res);
    if(rows.length>5){
        rows = rows.slice(0,5);
    }
    return rows;
};

export {addAnswer, deleteAnswerByOptionId, getNumberOfAnswers, getNumberOfCorrectAnswers, getNumberOfAnswersByUser, getUsersWithMostAnswers};