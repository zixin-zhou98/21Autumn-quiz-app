import { executeQuery } from "../database/database.js";
const addUser = async (email,password) => {
    await executeQuery("INSERT INTO users (email,password) values ($1, $2);",
    email,
    password);
};

const findUserByEmail = async (email) => {
    const res = await executeQuery("SELECT * FROM users WHERE email = $1;",
    email);
    if(res && res.rows.length>0){
        return res.rows[0];
    }
    return;
    
};

const findUserById  = async (id) => {
    const res = await executeQuery("SELECT * FROM users WHERE id = $1;",id);
    if(res && res.rows.length>0){
        return res.rows[0];
    }
    return;
    
};

const findAllUsers = async () => {
    const res = await executeQuery("SELECT * FROM users;");
    if(res && res.rows.length>0){
        return res.rows;
    }
    return;
};
export {addUser, findUserByEmail, findUserById, findAllUsers};