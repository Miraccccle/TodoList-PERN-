const PORT = process.env.PORT ?? 8000
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const app = express()
const pool = require('./db.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cors())
app.use(express.json())
//get all todos

app.get('/groups/:userEmail', async (req, res) => {
    const { userEmail } = req.params

    try {
        const groups = await pool.query(`SELECT * FROM groups WHERE user_email = $1 AND NOT name = 'My day'`, [userEmail])
        res.json(groups.rows)
    }
    catch (err) {
        console.log(err)
    } 
})

//select my day
app.get('/group/:userEmail', async (req, res) => {
    const { userEmail } = req.params

    try {
        const group = await pool.query(`SELECT * FROM groups WHERE user_email = $1 AND name = 'My day'`, [userEmail])
        res.json(group.rows)

    }
    catch (err) {
        console.log(err)
    } 
})



//get todos from group
app.get('/todos/:groupId', async (req, res) => {
    const { groupId } = req.params

    try {
        const todos = await pool.query('SELECT * FROM todos WHERE group_id = $1', [groupId])
        res.json(todos.rows)
        
    }
    catch (err) {
        console.log(err)
    } 
})

//select important todos
app.get('/important/:userEmail', async (req, res) => {
    const { userEmail } = req.params

    try {
        const todos = await pool.query(`SELECT * FROM todos WHERE important = 1 AND user_email = $1;`, [userEmail])
        res.json(todos.rows)

    }
    catch (err) {
        console.log(err)
    } 
})

//select completed todos
app.get('/completed/:userEmail', async (req, res) => {
    const { userEmail } = req.params

    try {
        const todo = await pool.query(`SELECT * FROM public.todos WHERE progress > 99 AND user_email = $1;`, [userEmail])
        res.json(todo.rows)

    }
    catch (err) {
        console.log(err)
    } 
})
//select all todos
app.get('/all/:userEmail', async (req, res) => {
    const { userEmail } = req.params

    try {
        const todo = await pool.query(`SELECT * FROM public.todos WHERE user_email = $1;`, [userEmail])
        res.json(todo.rows)

    }
    catch (err) {
        console.log(err)
    } 
})


//create a new group
app.post('/groups', async (req, res) => {
    const {date, user_email, name} = req.body
    const id = uuidv4()
    try{
        const newGroup = await pool.query(`INSERT INTO groups(id, date, user_email, name) VALUES ($1, $2, $3, $4)`,
        [id, date, user_email, name])
        res.json(newGroup)
    } catch(err) {
        console.error(err)
    }
})

//edit a group
app.put('/groups/:id', async (req, res) => {
    const { id } = req.params
    const {date, user_email, name} = req.body
    try {
        const editGroup = await pool.query('UPDATE groups SET date = $1, user_email = $2, name = $3 WHERE id = $4;', 
        [date, user_email, name, id])
        res.json(editGroup)
    }
    catch(err) {
        console.error(err)
    }
})

//delete a group
app.delete('/groups/:id', async (req, res) => {
    const { id } = req.params
    
    try {
        const deleteGroup = await pool.query('DELETE FROM groups WHERE id = $1;', [id])
        const deleteToDo = await pool.query('DELETE FROM todos WHERE group_id = $1;', [id])
        const deleteMinitask = await pool.query('DELETE FROM minitasks WHERE group_id = $1;', [id])
        res.json({deleteGroup, deleteToDo, deleteMinitask})
    }
    catch(err) {
        console.error(err)
    }
})



//create a new todo
app.post('/todos', async (req, res) => {
    const {user_email, title, progress, date, group_id, important} = req.body
    const id = uuidv4()
   // console.log(user_email, title, progress, date, group_id, important, id)
    try{
        const newToDo = await pool.query(`INSERT INTO todos(id, user_email, title, progress, date, group_id, important) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [id, user_email, title, progress, date, group_id, important])
        res.json(newToDo)
    } catch (err) {
        console.error(err)
    }
})

//edit a todo
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params
    const {user_email, title, progress, date, group_id, important} = req.body
    //console.log(user_email, title, progress, date, group_id, important, id)
    try {
        const editToDo = await pool.query('UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4, group_id = $5, important = $6 WHERE id = $7;', 
        [user_email, title, progress, date, group_id, important, id])
        res.json(editToDo)
    }
    catch(err) {
        console.error(err)
    }
})

//delete a todo
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params
    
    try {
        const deleteToDo = await pool.query('DELETE FROM todos WHERE id = $1;', [id])
        const deleteMinitask = await pool.query('DELETE FROM minitasks WHERE task_id = $1;', [id])
        res.json({deleteToDo, deleteMinitask})
    }
    catch(err) {
        console.error(err)
    }
})


//get minitasks from todos
app.get('/minitasks/:taskID', async (req, res) => {
    const { taskID } = req.params

    try {
        const minitask = await pool.query('SELECT * FROM minitasks WHERE task_id = $1', [taskID])
        res.json(minitask.rows)
    }
    catch (err) {
        console.log(err)
    } 
})

app.get('/length/:email', async (req, res) => {
    const { email } = req.params

    try {
        const minitask = await pool.query(`SELECT task_id, count(*) FILTER (WHERE completed = '1' and user_email = $1) AS completed, count(*) FILTER (WHERE user_email = $1) AS count FROM minitasks GROUP BY task_id`, [email])
        res.json(minitask.rows)
        
    }
    catch (err) {
        console.log(err)
    } 
})



//create a new minitask
app.post('/minitasks', async (req, res) => {
    const {user_email, name, completed, date, task_id, group_id} = req.body
    
    const id = uuidv4()

    try{
        const newMinitask = await pool.query(`INSERT INTO minitasks(id, user_email, name, completed, date, task_id, group_id) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [id, user_email, name, completed, date, task_id, group_id])
        res.json(newMinitask)
    } catch (err) {
        console.error(err)
    }
})

//edit a minitask
app.put('/minitasks/:id', async (req, res) => {
    const { id } = req.params
    const {user_email, name, completed, date, task_id, group_id} = req.body
//console.log(user_email, name, completed, date, task_id, group_id, id)
    try {
        const editMinitask = await pool.query('UPDATE minitasks SET user_email = $1, name = $2, completed = $3, date = $4, task_id = $5, group_id = $6 WHERE id = $7;', 
        [user_email, name, completed, date, task_id, group_id, id])
        res.json(editMinitask)
    }
    catch(err) {
        console.error(err)
    }
})

//delete a minitask
app.delete('/minitasks/:id', async (req, res) => {
    const { id } = req.params
    
    try {
        const deleteMinitask = await pool.query('DELETE FROM minitasks WHERE id = $1;', [id])
        res.json(deleteMinitask)
    }
    catch(err) {
        console.error(err)
    }
})

// signup
app.post('/signup', async (req, res) => {
    const {email, password} = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    const id = uuidv4()
    const date = new Date()
    try {
        const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES($1, $2);`,
        [email, hashedPassword])
        const newGroup = await pool.query(`INSERT INTO groups(id, date, user_email, name) VALUES ($1, $2, $3, 'My day')`,
        [id, date, email])
        const token = jwt.sign({email}, 'secret', { expiresIn: '1hr'})
        res.json({email, token, newGroup})
    } catch (err) {
        console.error(err)
        if(err) {
            res.json({detail: err.detail})
        }
    }
})

//login

app.post('/login', async (req, res) => {
    const {email, password} = req.body
    try {
        const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if(!users.rows.length) return res.json({ detail: 'User does not exist!'})

        const success = await bcrypt.compare(password, users.rows[0].hashed_password)
        const token = jwt.sign({email}, 'secret', { expiresIn: '1hr'})
    

        if (success) {
            res.json({'email': users.rows[0].email, token})
        } else {
            res.json({ detail: "Login failed!"})
        }
    } catch (err) {
        console.error(err)
    }
})
app.listen(PORT, ()=> console.log (`Server running in PORT ${PORT}`))