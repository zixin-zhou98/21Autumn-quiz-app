import { Router } from "../deps.js";
import * as questionController from "./controllers/questionController.js";
import * as optionController from "./controllers/optionController.js";
import * as userController from "./controllers/userController.js";
import * as quizController from "./controllers/quizController.js";
import * as quizApi from "./apis/quizApi.js";
const router = new Router();
router.get("/questions", questionController.listQuestions);
router.post("/questions", questionController.addQuestion);
router.post("/questions/:id/delete", questionController.deleteQuestion);
router.get("/questions/:id", questionController.listQuestion);

router.post("/questions/:id/options", optionController.addOption);
router.post("/questions/:questionId/options/:optionId/delete", optionController.deleteOption);

router.get("/auth/register",userController.showRegistrationForm);
router.post("/auth/register", userController.register);
router.get("/auth/login",userController.showLoginForm);
router.post("/auth/login", userController.login);

router.get("/quiz/:id",quizController.listQuiz);
router.get("/quiz",quizController.showRandomQuiz);

router.post("/quiz/:id/options/:optionId",quizController.chooseOption);
router.get("/quiz/:id/correct",quizController.showCorrectPage);
router.get("/quiz/:id/incorrect",quizController.showIncorrectPage);
router.get("/statistics",quizController.showStatistics);
router.get("/",questionController.showMain);

//api
router.get("/api/questions/random",quizApi.getRandomQuestion);
router.post("/api/questions/answer",quizApi.answerQustion);
export { router };
