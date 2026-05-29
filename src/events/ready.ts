import { Client, Events } from "discord.js";
import { Event } from "../structures/Event";

const event = new Event( {
    name: Events.ClientReady,
    once: true,
    execute(client : Client) {
        console.log(`Logged in as ${client.user?.tag}`)
    } 
});

export default event;