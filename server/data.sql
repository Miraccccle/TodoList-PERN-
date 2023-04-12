CREATE DATABASE todoapp;

CREATE TABLE todos (
    id VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR(255),
    title VARCHAR(30),
    progress INT,
    date VARCHAR(300)
);

CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    hashed_password VARCHAR(255)
);

CREATE TABLE groups (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    date VARCHAR(300)
);

INSERT INTO todos(id, user_email, title, progrss, date) VALUES ('0', 'mirasgaziz@test.com', 'First todo', 10, 'Thu Dec 29 2022 13:25:45 GMT+500 (Gulf Standard Time'));

UPDATE public.todos SET
user_email = 'sadfsdf@sdfsdf.com', title = 'aFefEFwe', progress = '90', date = '2023-02-19T13:24:30.486Z' WHERE
id = '19bd6ee5-e79e-4429-825e-70da9f5e7215';

UPDATE public.todos SET
user_email = $1, title = $2, progress = $3, date = $4 WHERE
id = $5;
