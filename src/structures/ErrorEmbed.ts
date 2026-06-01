import { ColorResolvable, EmbedBuilder } from "discord.js";

export class ErrorEmbed extends EmbedBuilder {
  public static COLOR: ColorResolvable = [255, 51, 51];

  public constructor(message: string) {
    super();
    this.setColor(ErrorEmbed.COLOR);
    this.setDescription(message);
  }
}
