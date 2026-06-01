import { ColorResolvable, EmbedBuilder } from "discord.js";

export class ErrorEmbed extends EmbedBuilder {
  private COLOR: ColorResolvable = [255, 51, 51];
  private embed: EmbedBuilder = new EmbedBuilder();

  public constructor(message: string) {
    super();
    this.embed.setColor(this.COLOR);
    this.embed.setDescription(message);
  }
}
