import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";
const getRandomQuestion = async ({ response }) => {
  const questionId = await questionService.generateRandomQuestionId();
  if (questionId){
    const quiz = await questionService.findQuestionById(questionId);
    const options = await optionService.findOptionByQuestionId(questionId);
    let optionsRes = [];
    options.forEach((option)=>{optionsRes.push({optionId:option.id,optionText:option.option_text})});
    response.body = {questionId:quiz.id,questionTitle:quiz.title,questionText:quiz.question_text,answerOptions:optionsRes};
  }
  else{
    response.body = {};
  }
};

const answerQustion = async ({ request, response }) => {
    const body = request.body({ type: "json" });
    const document = await body.value;
    const optionId = document.optionId;
    const option = await optionService.findOptionById(optionId);
    response.body = {correct:option.is_correct};
  };

export { getRandomQuestion, answerQustion };