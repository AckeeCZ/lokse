import { OutputFormat } from "../../constants";

import { Transformer } from "./transformer";
import iOSTransformer from "./ios";
import androidTransformer from "./android";
import jsonTransformer from "./json";
import { dartTransformer /* , dartTemplateTransformer */ } from "./dart";
import dotNetTransformer from "./dot-net";

export const transformersByFormat = {
  [OutputFormat.IOS]: iOSTransformer,
  [OutputFormat.ANDROID]: androidTransformer,
  [OutputFormat.JSON]: jsonTransformer,
  [OutputFormat.DART]: dartTransformer,
  // [OutputFormat.]: dartTemplateTransformer,
  [OutputFormat.DOT_NET]: dotNetTransformer,
};

export default Transformer;
