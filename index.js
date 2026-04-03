const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    }
});

let messages = {};

// QR
client.on('qr', (qr) => {
    console.log("Scan this QR:");
    qrcode.generate(qr, { small: true });
});

// Ready
client.on('ready', () => {
    console.log('✅ Bot is ready!');
});

// Save messages
client.on('message', msg => {
    messages[msg.id.id] = msg.body;

    const log = `[${new Date().toLocaleString()}] ${msg.from}: ${msg.body}\n`;
    fs.appendFileSync('messages.txt', log);
});

// Detect deleted messages
client.on('message_revoke_everyone', async (after, before) => {
    if (before) {
        let deletedMsg = before.body;

        // 👉 මෙතන ඔයාගේ number එක දාන්න
        let myNumber = "94769697341@c.us";

        let text = `🗑️ Deleted Message:\n${deletedMsg}`;

        await client.sendMessage(myNumber, text);

        const log = `[DELETED] ${new Date().toLocaleString()} ${before.from}: ${deletedMsg}\n`;
        fs.appendFileSync('deleted.txt', log);

        console.log("Deleted message saved!");
    }
});

client.initialize();
