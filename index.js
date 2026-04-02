const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false,
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    }
});

client.on('qr', (qr) => {
    console.log("QR RECEIVED");
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot is ready!');
});

client.initialize();

client.on('message_revoke_everyone', async (after, before) => {
    try {
        if (before) {
            const deletedLog = `[DELETED] ${new Date().toLocaleString()} ${before.from}: ${before.body}\n`;

            const fs = require('fs');
            fs.appendFileSync('deleted.txt', deletedLog);

            console.log("Deleted message saved!");
        }
    } catch (err) {
        console.log("Error detecting delete:", err);
    }
});

const fs = require('fs');

client.on('message', async message => {
    try {
        const text = message.body || "[No Text]";

        const log = `[${new Date().toLocaleString()}] ${message.from}: ${text}\n`;

        fs.appendFileSync('messages.txt', log);

        console.log("Message saved:", text);
    } catch (err) {
        console.log("Error saving message:", err);
    }
});