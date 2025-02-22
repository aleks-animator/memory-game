export const badWords = [
    // English
    "ass", "asshole", "bastard", "bitch", "bollocks", "bullshit", "cock", "crap",
    "cunt", "damn", "dick", "dumbass", "dipshit", "douche", "fag", "faggot",
    "fuck", "fucker", "fucking", "jerk", "motherfucker", "moron", "nazi", "piss",
    "prick", "pussy", "retard", "shit", "shitty", "slut", "stupid", "twat", "whore",
    "wanker",

    // German
    "arsch", "arschloch", "bastard", "drecksau", "dumme", "dummkopf", "fotze", "fick",
    "ficker", "ficken", "hurensohn", "mist", "scheiße", "schlampe", "schwachkopf",
    "spasti", "trottel", "verdammt", "wichser",

    // Spanish
    "cabron", "cojones", "gilipollas", "hijo de puta", "joder", "mierda", "pendejo",
    "puta", "puto",

    // French
    "connard", "connerie", "cul", "enculé", "merde", "pute", "salope"
];

// Convert bad words into regex patterns (e.g., "f.u.c.k", "f***k")
export const badWordPatterns = badWords.map(word => {
    return word
        .split("")
        .join("[^a-zA-Z]*")  // Allows any symbols/numbers between letters
        .replace(/a/g, "[a@4]")
        .replace(/e/g, "[e3]")
        .replace(/i/g, "[i1!]")
        .replace(/o/g, "[o0]")
        .replace(/s/g, "[s$5]")
});
