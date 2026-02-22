const TelegramBot = require("node-telegram-bot-api");
const db = require("./firebase");

const bot = new TelegramBot("BOT_TOKEN", { polling: true });
const CHANNEL = "@YOUR_CHANNEL";

bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
  const userId = msg.chat.id;
  const ref = match[1];

  // Channel verify
  try {
    const member = await bot.getChatMember(CHANNEL, userId);
    if (member.status === "left") throw "not joined";
  } catch {
    return bot.sendMessage(userId,
      "❌ Please join channel first",
      { reply_markup:{ inline_keyboard:[[{
        text:"Join Channel",
        url:"https://t.me/YOUR_CHANNEL"
      }]]}}
    );
  }

  const userRef = db.collection("users").doc(String(userId));
  const doc = await userRef.get();

  if (!doc.exists) {
    await userRef.set({
      points: 0,
      invited: 0,
      created: Date.now()
    });

    // Invite reward
    if (ref) {
      const refUser = db.collection("users").doc(ref);
      await refUser.update({
        points: admin.firestore.FieldValue.increment(10),
        invited: admin.firestore.FieldValue.increment(1)
      });
    }
  }

  bot.sendMessage(userId,
`✅ Welcome to AH ZONE 7 Rewards

Your invite link:
https://t.me/YOUR_BOT?start=${userId}`,
{
  reply_markup:{
    inline_keyboard:[[
      { text:"🎁 Open Rewards App", web_app:{ url:"WEB_APP_URL" } }
    ]]
  }
});
