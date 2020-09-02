import { Command } from "@oclif/command";
import { cosmiconfig } from "cosmiconfig";
import { NAME, OutputFormat } from './constants';

const explorer = cosmiconfig(NAME);

type ConfigType = {
  sheet_id?: string;
  dir?: string;
  languages?: string[];
  column?: string;
  format?: typeof OutputFormat;
};

export default abstract class Base extends Command {
  protected conf: undefined | null | ConfigType;

  async init() {
    const result = await explorer.search();
    this.conf = result?.config;
  }
}
