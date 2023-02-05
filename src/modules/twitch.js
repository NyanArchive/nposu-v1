const osuv2 = require("./osuv2.js")
const { npdata } = require("./rpc.js")
const { osu_beatmap_patterns, osu_profile_pattern } = require("./pattern.js")

const on_message = async (twitch_client, osuirc_client, settings) => {
    const osusend = async (username, message) => {
        const user = osuirc_client.getUser(username)
        user.sendMessage(message)
    }

    twitch_client.on("message", async (channel, tags, message, self) => {
        if (self) return
        if (settings.np_on && message.toLowerCase() === "!np" && await npdata()) {
            return twitch_client.say(channel, await npdata())
        }
        const profile_matches = message.match(osu_profile_pattern)
        if (profile_matches) {
            const user = await osuv2.get_user_info(profile_matches[profile_matches.length - 1])
            if (!user) return
            return twitch_client.say(channel, `${user.username} - #${user.rank} (${user.country_code}: #${user.country_rank}) ${user.pp}pp`)
        }
        if (tags.badges?.broadcaster) return
        for (let pattern in osu_beatmap_patterns) {
            const matches = message.match(osu_beatmap_patterns[pattern])
            if (matches) {
                if (pattern.includes("beatmap_")) {
                    const beatmap = await osuv2.get_beatmap_info(matches[matches.length - 1])
                    if (!beatmap) return
                    twitch_client.say(channel, `[${beatmap.status}] ${beatmap.artist} - ${beatmap.title} [${beatmap.version}] | ${beatmap.bpm}BPM ${beatmap.difficulty_rating}★ `)
                    await osusend(settings.channels[channel.replace("#", "")], `@${tags.username} -> [${beatmap.status}] [https://osu.ppy.sh/b/${beatmap.id} ${beatmap.artist} - ${beatmap.title} [${beatmap.version}]] | ${beatmap.bpm}BPM ${beatmap.difficulty_rating}★ | [https://api.nerinyan.moe/d/${beatmap.setid} alternative dl]`)
                    break
                } else {
                    const beatmapsets = await osuv2.get_beatmapsets_info(matches[matches.length - 1])
                    if (!beatmapsets) return
                    twitch_client.say(channel, `[${beatmapsets.status}] ${beatmapsets.artist} - ${beatmapsets.title} | mapped by ${beatmapsets.creator} | ${beatmapsets.beatmaps} beatmap(s)`)
                    await osusend(settings.channels[channel.replace("#", "")], `@${tags.username} -> [${beatmapsets.status}] [https://osu.ppy.sh/s/${beatmapsets.id} ${beatmapsets.artist} - ${beatmapsets.title}] | mapped by ${beatmapsets.creator} | ${beatmapsets.beatmaps} beatmap(s) | [https://api.nerinyan.moe/d/${beatmapsets.id} alternative dl]`)
                    break
                }
            }
        }
    })
}

module.exports = { on_message }
