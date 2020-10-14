const {check, validationResult} = require("express-validator")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const {Router} = require('express')
const router = Router()

router.post("/registration",
    [
        check("email", "Invalid email").isEmail(),
        check("username", "Username failed is empty").isLength({min: 1}),
        check("password", "Minimum length of password is 6 symbols").isLength({min: 6})
    ],
     async (req, res) => {
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid register data"
            })
        }
        const {email, username, password} = req.body
        if (await User.findOne({email})) {
            res.status(400). json({message: "User with this email already exists"})
        }
        if (await User.findOne({username})) {
            res.status(400). json({message: "User with such username already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({email: email, username: username, password: hashedPassword})
        await user.save()
        res.status(201).json({message: "User created"})
    } catch (err) {res.status(500).json({message: "Something go wrong, try again"})}
})

router.post("/login",
    [
        check("email", "Invalid email").isEmail(),
        check("password", "Minimum length of password is 6 symbols").isLength({min: 6})
    ],
    async (req, res) => {
        try{
            const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Invalid login data"
                })
            }
            //console.log(req.headers.authorization)
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (! user) {
                return res.status(400). json({message: "Something go wrong, try again"})
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch){
                return res.status(400).json({message: "password Something go wrong, try again"})
            }
            const token = jwt.sign(
                {userId: user.id},
                config.get("jwtSecret"),
                {expiresIn: "1h"}
            )
            res.json({token, userId: user.id})
        } catch (err) {res.status(500).json({message: "Something go wrong try again"})}
    })

module.exports = router