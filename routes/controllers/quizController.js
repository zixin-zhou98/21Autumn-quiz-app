import * as questionService from "../../services/questionService.js";
import * as optionService from "../../services/optionService.js";
import * as answerService from "../../services/answerService.js";
import * as userService from "../../services/userService.js";

const showRandomQuiz = async ({response, render}) => {
    const questionId = await questionService.generateRandomQuestionId();
    if (questionId){
        response.redirect(`/quiz/${questionId}`);
    }
    else {
        render("noQuiz.eta");
    }
};

const listQuiz = async ({params,render,user}) => {
    const question = await questionService.findQuestionById(params.id);
    const options = await optionService.findOptionByQuestionId(params.id);
    const data = {question:question,options:options,user:user};
    render("quiz.eta",data);
};

const chooseOption = async ({params, user, response}) => {
    const questionId = params.id;
    const optionId = params.optionId;
    const option = await optionService.findOptionById(optionId);
    await answerService.addAnswer(user.id,questionId,optionId,option.is_correct);
    if (option.is_correct){
        response.redirect(`/quiz/${questionId}/correct`);
    }
    else{
        response.redirect(`/quiz/${questionId}/incorrect`);
    }
};

const showCorrectPage = ({render,user})=>{
    render("correct.eta",{user:user});
};

const showIncorrectPage = async ({render, params, user})=>{
    const options = await optionService.findOptionByQuestionId(params.id);
    let correctOption = {};
    for (let option of options){
        if (option.is_correct){
            correctOption = option;
            break;
        }
    }
    render("incorrect.eta",{option:correctOption,user:user});
};

const showStatistics  = async ({render, user})=>{
    const numAnswer = await answerService.getNumberOfAnswers(user.id);
    const numCorrectAnswer = await answerService.getNumberOfCorrectAnswers(user.id);
    const numAnswerToQuestions = await answerService.getNumberOfAnswersByUser(user.id);
    
    const users = await answerService.getUsersWithMostAnswers();
    for (let i=0;i<users.length;i++){
        const user = await userService.findUserById(users[i].user_id);
        users[i].email=user.email;
    }
    
    const data = {numAnswer:numAnswer,numCorrectAnswer:numCorrectAnswer,numAnswerToQuestions:numAnswerToQuestions,users:users,user:user}; 
    render("statistics.eta",data);
};
export {listQuiz, showRandomQuiz, chooseOption, showCorrectPage, showIncorrectPage, showStatistics};