import iOSTransformer from "./ios";
import androidTransformer from "./android";
import jsonTransformer from "./json";
import { dartTransformer/* , dartTemplateTransformer */ } from "./dart";
import dotNetTransformer from "./dot-net";
import { OutputFormat } from "../../constants";

const transformers = {
  [OutputFormat.IOS]: iOSTransformer,
  [OutputFormat.ANDROID]: androidTransformer,
  [OutputFormat.JSON]: jsonTransformer,
  [OutputFormat.DART]: dartTransformer,
  // [OutputFormat.]: dartTemplateTransformer,
  [OutputFormat.DOT_NET]: dotNetTransformer,
};

export default transformers;