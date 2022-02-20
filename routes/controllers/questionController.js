import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";
import { validasaur } from "../../deps.js";

const questionValidationRules = {
    title: [validasaur.required, validasaur.minLength(1)],
    question_text: [validasaur.required, validasaur.minLength(1)],
};

const showMain = ({ render }) => {
  render("main.eta");
};

const listQuestion = async ({render,params,user,response}) =>{
  const question=await questionService.findQuestionById(params.id);
  //verification: only owner of the question can visit the question page
  if(question.user_id!==user.id){
    response.redirect("/questions");
  }
  else{
    const options=await optionService.findOptionByQuestionId(params.id);
    const data={question:question,options:options,user:user};
    render("question.eta",data);
  }
};

const listQuestions =async ({ user,render}) => {
  const questions=await questionService.findQuestionsByUser(user.id);
  const data={questions:questions,question:{title:"",question_text:""},user:user};
  render("questions.eta",data);
};

const addQuestion = async ({ request,response,render,user }) => {
  const body=request.body({type:"form"});
  const params=await body.value;
  const title=params.get("title");
  const userId=user.id;
  const questions=await questionService.findQuestionsByUser(userId);
  const question_text=params.get("question_text");
  const questionData = {title:title,question_text:question_text};
  const data = {questions:questions,question:questionData,user:user};
  const [passes, errors] = await validasaur.validate(
    questionData,
    questionValidationRules,
  );
  if (!passes){
    data.errors = errors;
    render("questions.eta",data);
  }
  else {
    await questionService.addQuestion(userId, title,question_text);
    response.redirect("/questions");
  }
};

const deleteQuestion = async ({response,params,user}) => {
  const questionId=params.id;
  const question=await questionService.findQuestionById(questionId);
  if(question.user_id!==user.id){
    response.redirect("/questions");
  }
  else{
    await questionService.deleteQuestion(questionId);
    response.redirect("/questions");
  }
};


export { showMain,addQuestion,listQuestions,listQuestion,deleteQuestion};
