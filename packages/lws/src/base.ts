import { Command } from "@oclif/command";
import { get as getConfig, ConfigType } from "./config";

export default abstract class Base extends Command {
  protected conf: undefined | null | ConfigType;

  async init() {
    this.conf = getConfig();
  }
}
