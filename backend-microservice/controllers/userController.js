const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

const Users = require('../models/User');

async function create(req, res) {
  try {
    // console.log("hit the create user controller");
    const data = req.body;
    // console.log(data, "data passed to the creatte controller");
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS))
    data["password"] = await bcrypt.hash(data.password, salt)
    const newUser = await Users.create(data);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req,res){
  const data = req.body;
    try{
        const user = await Users.getUserByUserName(data.username)
        const match = await bcrypt.compare(data.password, user.passwordHash)
        if(match){
            console.log(user);
            const payload = {username: user.id}
            // console.log(token);
            const sendToken = (err, token) => {
                if(err){
                    throw Error("Error in token generation")

                }
                res.status(200).json({
                    success:true,
                    token: token,
                    user_id: payload.username
                    
                })
            }
            jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: 3600}, sendToken)
            // res.status(200).json({ success: true})

        }else{
            throw Error("User could not be authenticated")
        }

    } catch (err) {
        res.status(401).json({ error: err.message})
    }
}

async function show(req, res) {
  try {
    let id = req.params.id;
    const user = await Users.getPostcodeById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const id = req.params.id;
    const data = req.body;
    const user = await Users.getUserById(id);
    const result = await user.update(data);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function destroy(req, res) {
  try {
    const id = req.params.id;
    const user = await Users.getUserById(id);
    const result = await user.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

module.exports = { create, login, show, update, destroy };
