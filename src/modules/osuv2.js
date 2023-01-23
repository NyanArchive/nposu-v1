const settings = require("../../settings.js")
const fetch = require("node-fetch")

let osutoken_data
let osutoken
let recentRefresh

const get_token = (async () => {
    console.log("Fetching osu!v2 token..")
    recentRefresh = Math.floor(new Date().getTime() / 1000)
    const token = await fetch("https://osu.ppy.sh/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_id: settings.osuv2_client_id,
            client_secret: settings.osuv2_client_secret,
            grant_type: "client_credentials",
            scope: "public"
        })
    })
    osutoken_data = await token.json()
    console.log(`osuv2 token expires in: ${osutoken_data.expires_in}`)
    osutoken = osutoken_data.access_token
    return osutoken_data
})

osutoken_data = get_token().then(res => res)

const refresh_token = (async () => {
    let expire = recentRefresh + osutoken_data.expires_in
    let now = Math.floor(new Date().getTime() / 1000)
    if (expire - now <= 0) {
        osutoken_data = await get_token()
        osutoken = osutoken_data.access_token
    }
    return osutoken
})


const get_beatmap_info = async (beatmap_id) => {
    const beatmap = await fetch(`https://osu.ppy.sh/api/v2/beatmaps/${beatmap_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${await refresh_token()}`
        }
    })
    const data = await beatmap.json()

    if (!data.id) return null
    else return {
        id: data.id,
        setid: data.beatmapset_id,
        title: data.beatmapset.title,
        artist: data.beatmapset.artist,
        status: data.beatmapset.status.toUpperCase(),
        version: data.version,
        difficulty_rating: data.difficulty_rating,
        bpm: data.bpm,
    }
}
const get_beatmapsets_info = async (beatmapsets_id) => {
    const beatmapsets = await fetch(`https://osu.ppy.sh/api/v2/beatmapsets/${beatmapsets_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${await refresh_token()}`
        }
    })
    const data = await beatmapsets.json()
    if (!data.id) return null
    else return {
        artist: data.artist,
        creator: data.creator,
        status: data.status.toUpperCase(),
        title: data.title,
        beatmaps: data.beatmaps.length
    }
}
const get_user_info = async (user_id) => {
    await refresh_token()
    const user = await fetch(`https://osu.ppy.sh/api/v2/users/${user_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${await refresh_token()}`
        }
    })
    const data = await user.json()

    if (!data.id) return null
    else return {
        country_code: data.country.code,
        id: data.id,
        username: data.username,
        pp: data.statistics.pp,
        rank: data.statistics.global_rank,
        country_rank: data.statistics.country_rank,
    }
}

module.exports = { get_beatmap_info, get_beatmapsets_info, get_user_info }