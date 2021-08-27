import { createPlugin } from "@lokse/core";
import type { GeneralPluginOptions, LoksePlugin } from "@lokse/core";

export default function (
  /**
   * Your plugin will receive common options for all plugins 
   * plus any other options user pass in config file.
   */
  options: GeneralPluginOptions
): LoksePlugin {
  return createPlugin({
    /**
     * Here is the place to implement any of LoksePlugin hooks
     * and some useful operations.
     * Read https://github.com/AckeeCZ/lokse/tree/master/doc/Plugins.md
     */
  });
}
