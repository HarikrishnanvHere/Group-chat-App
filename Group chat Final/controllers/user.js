const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const saltRounds = 10;

function generateAccessToken(id, name, email, phone) {
  return jwt.sign({userId: id, name: name, email: email, phone: phone}, process.env.JWT_TOKEN_KEY);
}

exports.signupUser = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;

  try {
    const emailExisting = await User.findAll({ where: { email: email } });
    const phoneExisting = await User.findAll({ where: { phone: phone } });
    // console.log(response);

    if (emailExisting.length === 0 && phoneExisting.length === 0) {
    bcrypt.hash(password, saltRounds, async(err,hash) => {
      await User.create({
        name: name,
        email: email,
        phone:phone,
        password: hash,

      });
    });
     
      res.json({ alreadyexisting: false });
    }
    else {
      res.json({ alreadyexisting: true });
    }
  }  catch (error) {
    console.log(error);
  }
};

exports.loginUser = async (req, res, next) => {
const email = req.body.email;
const password = req.body.password;

try{
const user = await User.findAll({where : {email : email}});
if(user.length != 0){

  // console.log(user);
  bcrypt.compare(password, user[0].password, (err, response) => {

    if(response){
      res.status(200).json({message : "User logged in successfull" , token: generateAccessToken(user[0].id, user[0].name, user[0].email, user[0].phone), userId: user[0].id });
      
    }
    else if(!err) {
      res.status(400).json({message : "Password is incorrect"});
      
    }
    else {
      throw new Error ({message : "Something went wrong"});
  
    }
  });
       
      } else {
        res.status(404).json({message : "User is not registered"});
  
      }

} catch(err){
  console.log(err);
}
}