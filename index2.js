const express = require("express");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

const USER = {
    username: "admin",
    password: "1234",
}


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET || "it is a secret",
        resave: false,
        saveUninitialized: false,
    })
);


function needLogin(req, res, next){
    if(req.session.user){
        return next();
    }

    return res.status(401).send("Login First")
}

app.get("/", (req, res)=>{
    res.send(`
        <h1>Login</h1>
        <form method="post" action="/login">
        <input name="username" placeholder="Username" required>
        <input name="password" type="password" placeholder="Password" required>
        <button type="submit">Login</button>
        </form>
    `);
});

app.post("/login", async (req, res) =>{
    const {username, password} = req.body;
    if(username === USER.username && password === USER.password){
        req.session.user = {username: USER.username};

        return res.send("Login Successful");
    }
    return res.status(401).send("Invalid Credentials");
});

app.get("/dashboard", needLogin, (req, res) => {
  res.send(`Welcome to the dashboard ${req.session.user.username}`);
});

app.get("/logout", (req, res)=>{
    req.session.destroy((error)=>{
        if(error){
            return res.status(500).send("Logout failed");
        }
        return res.send("Logged out successfully");
    });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
