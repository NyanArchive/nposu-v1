const { WebSocket } = require("ws")

let npraw

const connect = () => {
    new WebSocket("ws://127.0.0.1:1337")
        .on("open", () => {
            console.log("websocket connected!")
        })
        .on("message", async (message) => {
            const data = JSON.parse(message)
            if (data.activity?.application_id === "367827983903490050") npraw = data
        })
        .on("error", async () => {
            console.log("failed to connect websocket! trying to run arrpc and recconecting..")
            await import("../arrpc/src/index.js")
            await connect()
        })
}

const npdata = () => {
    if (
        npraw?.activity?.application_id !== "367827983903490050"
        || npraw?.activity?.state === "Idle"
    ) return false
    return npraw.activity.details
}

module.exports = { connect, npdata }