import * as userService from "../../services/userService.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { validasaur } from "../../deps.js";

const registrationValidationRules = {
    email: [validasaur.required, validasaur.isEmail],
    password: [validasaur.required, validasaur.minLength(4)],
};

const showRegistrationForm = ({render}) =>{
    const data = {resistrationData:{email:""}};
    render("registration.eta",data);
};

const showLoginForm = async ({render}) =>{
    render("login.eta");
};

const register = async ({request, response, render}) => {
    const body = request.body({type:"form"});
    const params = await body.value;
    const password = params.get("password");
    const email = params.get("email");
    //validation
    const resistrationData = {email:email,password:password};
    const [passes, errors] = await validasaur.validate(
        resistrationData,
        registrationValidationRules,
      );
    if (!passes){
        const data = {resistrationData:resistrationData, errors:errors};
        render("registration.eta",data);
      }
      else {
        const hash = await bcrypt.hash(password);
        await userService.addUser(email,hash);
        response.redirect("/auth/login");
      }
   
    
};

const login = async ({request, response,state,render}) => {
    const body = request.body({type:"form"});
    const params = await body.value;
    const user = await userService.findUserByEmail(params.get("email"));
    let errors = [];
    if(user){
        await state.session.set("user",user);
        const passwordMatches = await bcrypt.compare(params.get("password"),user.password);
         if (passwordMatches){
            await state.session.set("user",user);
            response.redirect("/questions");
        }
        else{
            errors.push("Password is not correct!");
            render("/login.eta",{errors:errors});
        }
    }
    else{
        errors.push("User does not exist!");
        render("/login.eta",{errors:errors});
    }
};

export {register,showRegistrationForm,showLoginForm,login};