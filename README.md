# Documentation for question application
This is an application that allows users to add questions, options, and answer the questions. To use the application, the user need to register and log in. Any logged in user can view all the questions, and answer them. Logged in users can create and delete questions and options.</p>


## 1. Running the deployed version
The application has been deployed to heroku at https://zixin-wsd-project2.herokuapp.com/

## 2. Running the application locally

### a. Unzip the zip file, and the working directory is the directory where run-locally.js resides

### b. Change the database configuration in database/database.js line 4
The configuration can be similar to the following example.

    const connectionPool = new Pool({
        hostname: "hostname-possibly-at-elephantsql.com",
        database: "database-name",
        user: "user-name-typically-same-as-database-name",
        password: "password",
        port: 5432,
    }, CONCURRENT_CONNECTIONS);

### c. Create four tables using the following database schema in the configured database
    CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password CHAR(60)
    );

    CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(256) NOT NULL,
    question_text TEXT NOT NULL
    );

    CREATE TABLE question_answer_options (
    id SERIAL PRIMARY KEY,
    questionid INTEGER REFERENCES questions(id),
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false
    );

    CREATE TABLE question_answers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    question_id INTEGER REFERENCES questions(id),
    question_answer_option_id INTEGER REFERENCES question_answer_options(id),
    correct BOOLEAN DEFAULT false
    );

    CREATE UNIQUE INDEX ON users((lower(email)));

### d. This application runs on port 7777, so make sure that no other applications run on this port. 
### e. Run the following command in the working directory
    deno run --allow-all --unstable run-locally.js
### f. The application is available at http://localhost:7777/

## 3. Automanted testing
### a. Running the tests
This application includes 10 automated tests. Run the following commands in the working directory to see the testing results.
    
    deno test --allow-all --unstable ./tests/userService_test.js
    deno test --allow-all --unstable ./tests/app_test.js
    deno test --allow-all --unstable ./tests/questionService_test.js
    deno test --allow-all --unstable ./tests/answerService_test.js


### b. Content of the tests
The tests are designed for:
<ol>
    <li>Calling addUser(email='${numberOfUsers+1}@gmail.com',password='012345') creates a user</li>
    <li>Calling findUserByEmail(`${num}@gmail.com`) finds the user we just created</li>
    <li>Calling findUserById(id) finds the user we just created</li>
    <li>Get request to '/questions' without being authenticated will be redirected to '/auth/login'</li>
    <li>Get request to '/quiz' without being authenticated will be redirected to '/auth/login'</li>
    <li>Post request to '/auth/register' with password of length 3 will not create a user in the database</li>
    <li>Post request to '/auth/login' with correct password and email will be successful and the user will be redirected to /questions</li>
    <li>Post request to '/questions/:id/delete' without being authenticated as the creater of the question will not delete the question</li>
    <li>Calling deleteQuestion(question.id) will delete the question (after deletion, the question cannot be found)</li>
    <li>Calling getNumberOfAnswers(id), return the correct number of questions answered by the user</li>
</ol>

