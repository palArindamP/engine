const express = require('express');
const { findOne } = require('../model/userSchema');
const router = express.Router();

require("../db/connection");
const User = require("../model/userSchema");

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

router.get('/', (req, res) => {
    res.send('hello everyone')
})

// ////Process to bield post request and upload user data in database using async-await.
router.post('/register', async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Please fill all the fields." })
    }

    try {
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(422).json({ error: "Already exists." })
        } else if (password !== cpassword) {
            return res.status(422).json({ error: "Password and Confirm Password should be same." })
        }

        const user = new User({ name, email, phone, work, password, cpassword })
        //password hasing is done after taking all data from buse and before save that in database.
        // The hash code is in iserSchema.js file,

        // const userResigester = 
        await user.save()
        // if (userResigester) {
        res.status(201).json({ message: "Sucessfully resigester and data is added to database" })
        // } else {
        //     res.status(500).json({ error: "Failed to add data" })
        // }

    } catch (err) {
        console.log(err)
    }

    // console.log(req.body)
    // res.json({messssssage: req.body});
    // // res.send('reg');
});

// ////Process to bield post request and upload user data in database using promices(without using async-await).
// router.post('/register', (req, res) => {
//     const { name, email, phone, work, password, cpassword } = req.body;

//     if (!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({ error: "Please fill all the fields." })
//     }

//     User.findOne({ email: email })
//         .then((userExist) => {
//             if (userExist) {
//                 return res.status(422).json({ error: "Already exists." })
//             }

//             const user = new User({name:name, email:email, phone:phone, work:work, password:password, cpassword:cpassword})

//             user.save().then(() => {
//                 res.status(201).json({message:"Sucessfully resigester and data is added to database"})
//             }).catch((err) => {
//                 res.status(500).json({error:"Failed to add data"})
//             })
//         }).catch((err) =>{
//             res.status(505).json({error:err})
//         })
//     // console.log(req.body)
//     // res.json({messssssage: req.body});
//     // // res.send('reg');
// });

router.post("/signin", async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all the fields to signin sucessfully." })
        }

        const userSignin = await User.findOne({ email: email })  //check that email id is present or not
        // console.log(userSignin)
        if (userSignin) {
            const isMatch = await bcrypt.compare(password, userSignin.password)

            // Token for authontication. Some piece od code is in userSchema.js file.
            token = await userSignin.generateAuthToken();       
            console.log(token)
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            if (!isMatch) {
                res.status(400).json({ message: "Invalid Credintials." })
            } else {
                res.status(200).json({ message: "Signin Sucessfully." })
            }
        } else {
            res.status(400).json({ message: "Invalid Credintials." })
        }


    } catch (err) {
        console.log(err)
    }
    // console.log(req.body);
    // res.json({message:"Looking Good"})
})


module.exports = router;