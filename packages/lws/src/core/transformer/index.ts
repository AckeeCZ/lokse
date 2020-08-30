import iOSTransformer from "./ios";
import androidTransformer from "./android";
import jsonTransformer from "./json";
import { dartTransformer, dartTemplateTransformer } from "./dart";
import dotNetTransformer from "./dot-net";

export default {
  ios: iOSTransformer,
  android: androidTransformer,
  web: jsonTransformer,
  dart: dartTransformer,
  dartTemplate: dartTemplateTransformer,
  ".net": dotNetTransformer,
};
