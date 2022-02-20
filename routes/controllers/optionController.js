import * as optionService from "../../services/optionService.js";
import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";
import { validasaur } from "../../deps.js";

const optionValidationRules = {
  option_text: [validasaur.required, validasaur.minLength(1)],
};

const addOption = async ({request,params,response,render,user}) =>{
    //verify that the user who add options to the question is the owner of the question
    const questionId = params.id;
    const question = await questionService.findQuestionById(questionId);
    if(question.user_id!==user.id){
      response.redirect("/questions");
    }
    else{
      const body = request.body({type:"form"});
      const form_params = await body.value;
      const option_text=form_params.get("option_text");
      let is_correct = false;
      if(form_params.has("is_correct")){
          is_correct=form_params.get("is_correct");
      }
      //validation
      const optionData = {option_text:option_text, is_correct:is_correct};
      const options=await optionService.findOptionByQuestionId(questionId);
      
      const [passes, errors] = await validasaur.validate(
        optionData,
        optionValidationRules,
      );
      if (!passes){
        const data = {question:question,options:options,option:optionData};
        data.errors = errors;
        render("question.eta",data);
      }
      else{
        await optionService.addOption(questionId,option_text,is_correct);
        response.redirect(`/questions/${questionId}`);
      }
    }
    
  };

const deleteOption = async ({params,response,user})=>{
    //post: /questions/:questionId/options/:optionId/delete
    const questionId = params.questionId;
    const question = await questionService.findQuestionById(questionId);
    if(question.user_id!==user.id){
      response.redirect("/questions");
    }
    else{
      const optionId = params.optionId;
      //first delete the answers of this option from question_answers
      await answerService.deleteAnswerByOptionId(optionId);
      //delete the option from question_answer_options
      await optionService.deleteOption(questionId,optionId);
      response.redirect(`/questions/${questionId}`);
    }

};
  export {addOption,deleteOption};