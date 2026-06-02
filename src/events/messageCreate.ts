import { Events, Message, BaseGuildTextChannel } from "discord.js";
import { Event } from "../structures/Event";
import { Logger } from "../utils/logger";

const banned: { [key: string]: string } = {
  idiot: "バカ",
  con: "バカ",
  imbécile: "間抜け",
  crétin: "アホ",
  abruti: "ボケ",
  connard: "クソ野郎",
  salaud: "ろくでなし",
  enfoiré: "この野郎",
  "pauvre con": "バカ野郎",
  "trou du cul": "クソったれ",
  ordure: "人間のクズ",
  "sale type": "嫌な奴",
  "fils de pute": "クソ野郎",
  fdp: "クソ野郎",
  débile: "知恵遅れ",
  debile: "知恵遅れ",
  "gros con": "大バカ",
  bouffon: "道化者",
  merde: "クソ",
  putain: "くそ",
  marchetti: "Marchetitebite",
  lilian: "gay",
  vector: "gay",
};

const sortedKeys = Object.keys(banned).sort((a, b) => b.length - a.length);
const rgx = new RegExp(sortedKeys.map((key) => `\\b${key}\\b`).join("|"), "gi");

const event = new Event({
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    if (message.author.bot) return;
    if (!message.content.match(rgx)) return;

    try {
      await message.delete();

      const channel = message.channel as BaseGuildTextChannel;
      const channelWebhooks = await channel.fetchWebhooks();
      let webhook = channelWebhooks.first();

      if (!webhook) {
        webhook = await channel.createWebhook({
          name: "Bot Shadow Editor",
          avatar: message.client.user?.displayAvatarURL(),
        });
      }

      const cleanedContent = message.content.replace(rgx, (match) => {
        return banned[match.toLowerCase()] || "バカ";
      });

      await webhook.send({
        content: cleanedContent,
        username: message.member?.displayName || message.author.username,
        avatarURL: message.author.displayAvatarURL(),
      });
    } catch (error) {
      Logger.error("Something went wrong while applying filters");
    }
  },
});

export default event;
