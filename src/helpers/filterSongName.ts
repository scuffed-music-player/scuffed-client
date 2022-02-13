const flags = [
    ["&quot;", "\""],
    ["&amp;", "&"],
    "[official audio]",
    "(official audio)",
    "full song",
    "(audio)",
    ["&#39;", "'"],
    "(lyrics)",
    "(official music video)",
    "(official music audio)",
    "(official lyric video)",
    "(lyric video)",
    "(official)",
    "(pseudo video)",
    "()",
    "[]",
    "「amv」",
    "[amv]",
    "[official lyric video]",
    "「 amv 」"
];

export const filterSongName = (name: string | null) => {
    if (!name) return "lmao idk song lol";

    let n = name.toLowerCase();
    flags.forEach(flag => {
        const replaceArgs: [string, string] = Array.isArray(flag) ? [flag[0], flag[1]] : [flag, ""];
        n = n.replaceAll(...replaceArgs);
    });
    n = n.trim();
    return n;
}