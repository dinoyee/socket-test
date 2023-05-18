import {WebSocketServer} from "ws"
import express from 'express'

const wss = new WebSocketServer({
    port: 8080
})

const app = express()

app.get('/', (req, res) => {
    const {id, message} = req.query
    const msg = sendMessage(id, message)
    res.send(msg)
})

app.listen(3000, () => {
    console.log('express is setup success!')
})

const userConnections = new Map()

wss.on('connection', (ws) => {
    const userId = genUserId()

    console.log(`user ::: '${userId}' is connect!`)
    ws.send(`your id ${userId}`)

    userConnections.set(userId, ws)

    ws.on('message', (message) => {
        console.log(`user ::: '${userId}', message ::: '${message}'`)
        ws.send(`send ::: ${message}`)
    })

    ws.on('close', () => {
        console.log(`user ::: '${userId}' is disconnect`)
        userConnections.delete(userId)
    })
})

console.log('wss is setup success!')

const genUserId = () => {
    return Math.random().toString(36).substring(2, 9)
}

const sendMessage = (userId, message) => {
    const ws = userConnections.get(userId)
    if (ws) {
        ws.send(message)
    }
    return !!ws
}