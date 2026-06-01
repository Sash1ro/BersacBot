import { ColorResolvable, EmbedBuilder } from "discord.js";

export class ErrorEmbed extends EmbedBuilder {
  private COLOR: ColorResolvable = [255, 51, 51];

  public constructor(message: string) {
    super();
    this.setColor(this.COLOR);
    this.setDescription(message);
  }
}
