const settings = require("../settings.js")
const twitch = require("./modules/twitch.js")
const bancho = require("bancho.js")
const twitchClient = require("tmi.js")
const rpc = require("./modules/rpc.js")

const osuirc_client = new bancho.BanchoClient({
    username: settings.osuirc_username,
    password: settings.osuirc_password,
})

const twitch_client = new twitchClient.Client({
    options: { debug: false },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: settings.ttv_username,
        password: settings.ttv_token
    },
    channels: Object.keys(settings.channels)
})

const run = async () => {
    await osuirc_client.connect()
    console.log(`osu!irc connected as ${osuirc_client.getSelf().ircUsername}`)
    if (settings.np_on) { rpc.connect() } else console.log("nowplaying feature disabled")
    await twitch_client.connect()
    console.log(`Twitch connected as ${twitch_client.getUsername()}`)
    await twitch.on_message(twitch_client, osuirc_client, settings)
}

run()