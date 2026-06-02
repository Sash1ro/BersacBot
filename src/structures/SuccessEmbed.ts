import { ColorResolvable, EmbedBuilder } from "discord.js";

export class SuccessEmbed extends EmbedBuilder {
  public static COLOR: ColorResolvable = [63, 55, 201];

  public constructor(message: string | null = null) {
    super();
    this.setColor(SuccessEmbed.COLOR);
    message && this.setDescription(message);
  }
}
