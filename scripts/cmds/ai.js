const axios = require('axios');

// Define the fonts mapping
const fonts = {
    a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶",
    j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿",
    s: "𝘀", t: "𝘁", u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇",
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
    J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
    S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
    ' ': ' ', // Keep space as is
};

async function fetchFromAI(url, params) {
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getAIResponse(input, userId, messageID) {
    const services = [
        { url: 'https://ai-tools.replit.app/gpt', params: { prompt: input, uid: userId } },
        { url: 'https://openaikey-x20f.onrender.com/api', params: { prompt: input } },
        { url: 'http://fi1.bot-hosting.net:6518/gpt', params: { query: input } },
        { url: 'https://ai-chat-gpt-4-lite.onrender.com/api/hercai', params: { question: input } }
    ];

    let response = "𝗛𝗶 𝗶'𝗺 𝗥𝗼𝗻𝗹𝗮𝗹𝗱'𝘀 𝗯𝗼𝘁 𝘄𝗵𝗮𝘁 𝗰𝗮𝗻 𝗶 𝗱𝗼 𝗳𝗼𝗿 𝘆𝗼𝘂 𝘁𝗼𝗱𝗮𝘆....(⁠◠⁠‿⁠◕⁠) 💙";
    let currentIndex = 0;

    for (let i = 0; i < services.length; i++) {
        const service = services[currentIndex];
        const data = await fetchFromAI(service.url, service.params);
        if (data && (data.gpt4 || data.reply || data.response)) {
            response = data.gpt4 || data.reply || data.response;
            break;
        }
        currentIndex = (currentIndex + 1) % services.length; // Move to the next service in the cycle
    }

    // Convert response to special fonts
    const convertedResponse = Array.from(response)
        .map(char => fonts[char] || char) // Use special font or original character if not in fonts
        .join('');

    return { response: convertedResponse, messageID };
}

module.exports = {
    config: {
        name: 'ai',
        author: 'aesther',
        role: 0,
        category: 'ai',
        shortDescription: 'ai to ask anything',
    },
    onStart: async function ({ api, event, args }) {
        const input = args.join(' ').trim();
        if (!input) {
            api.sendMessage(`🫰🌟`, event.threadID, event.messageID);
            return;
        }

        const { response, messageID } = await getAIResponse(input, event.senderID, event.messageID);
        api.sendMessage(`⚪🔵🔴`, event.threadID, messageID);
    },
    onChat: async function ({ event, message }) {
        const messageContent = event.body.trim().toLowerCase();
        if (messageContent.startsWith("ai")) {
            const input = messageContent.replace(/^ai\s*/, "").trim();
            const { response, messageID } = await getAIResponse(input, event.senderID, message.messageID);
            // Construct message with special fonts
            const formattedResponse = ` 𝑴𝒊𝒂 𝑨𝒆 💙 \n━━━━━━━━━━━━━━━━\n${response} \n━━━━━━━━━━━━━━━━`;
            message.reply(formattedResponse, messageID);
        }
    }
};
