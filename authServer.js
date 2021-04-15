import express from 'express'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const app = express();
dotenv.config()

app.use(express.json())

let refreshTokens = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(401)
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({name: user.name})
        res.json({accessToken: accessToken })
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const user = { name: username };

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN) // jwt.sign(user, process.env.REFRESH_TOKEN + user.password) for more security on refresh tokens
    refreshTokens.push(refreshToken)
    res.json({accessToken: accessToken, refreshToken: refreshToken})
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '15s'} )
}

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>  console.log(`Server Started on Port Number ${PORT}`))