import { Command } from "@oclif/command";
import { cosmiconfig } from "cosmiconfig";
import { NAME } from './constants';

const explorer = cosmiconfig(NAME);

type ConfigType = {
  sheet_id?: string;
  dir?: string;
  cols?: string[];
  type?: "key_web" | "key_android" | "key_ios";
};

export default abstract class Base extends Command {
  protected conf: undefined | null | ConfigType;

  async init() {
    const result = await explorer.search();
    this.conf = result?.config;
  }
}
