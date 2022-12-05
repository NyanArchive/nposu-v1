/**
 * regex from https://github.com/Fanyatsu/osu-requests-bot/blob/8f0eff8031924e0929b412749b8cb4a6059c4c7b/main.py#L31-L41
 */
const osu_beatmap_patterns = {
        "beatmap_official": /https?:\/\/osu.ppy.sh\/beatmapsets\/[0-9]+\#(osu|taiko|fruits|mania)\/([0-9]+)/,
        "beatmap_old": /https?:\/\/(osu|old).ppy.sh\/b\/([0-9]+)/,
        "beatmap_alternate": /https?:\/\/osu.ppy.sh\/beatmaps\/([0-9]+)/,
        "beatmap_old_alternate": /https?:\/\/(osu|old).ppy.sh\/p\/beatmap\?b=([0-9]+)/,
        "beatmapset_official": /https?:\/\/osu.ppy.sh\/beatmapsets\/([0-9]+)/,
        "beatmapset_old": /https?:\/\/(osu|old).ppy.sh\/s\/([0-9]+)/,
        "beatmapset_old_alternate": /https?:\/\/(osu|old).ppy.sh\/p\/beatmap\?s=([0-9]+)/,
    }
const osu_profile_pattern = /https?:\/\/(osu|old).ppy.sh\/(u|users)\/([^\s]+)/

module.exports = { osu_beatmap_patterns, osu_profile_pattern }