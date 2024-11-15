import { OutputFormat } from '../constants';

import { Transformer } from './transformer';
import iOSTransformer from './ios';
import androidTransformer from './android';
import jsonTransformer from './json';

export const transformersByFormat = {
    [OutputFormat.IOS]: iOSTransformer,
    [OutputFormat.ANDROID]: androidTransformer,
    [OutputFormat.JSON]: jsonTransformer,
};

export default Transformer;
