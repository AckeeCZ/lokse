import { Command } from "@oclif/command";
import * as updateNotifier from "update-notifier";

import { get as getConfig, ConfigType } from "./config";

const pkg = require("../package.json");

export default abstract class Base extends Command {
  protected conf: undefined | null | ConfigType;

  async init(): Promise<void> {
    const notifier = updateNotifier({
      pkg,
      updateCheckInterval: 1000,
      shouldNotifyInNpmScript: true,
    });
    notifier.notify();

    this.conf = getConfig();
  }
}
