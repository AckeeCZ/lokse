import { Command } from "@oclif/command";

const path = require("path");
const Ackeefile = require(path.join(process.cwd(), ".ackeeconfig"));

type ConfigType = {
  sheet_id?: string;
  dir?: string;
  cols?: string;
  type?: string;
};

export default abstract class Base extends Command {
  static config: null | ConfigType;

  async init() {
    this.config = Ackeefile;
  }
}
