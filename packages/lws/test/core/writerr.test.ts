import * as assert from "assert";
import {EOL} from 'os'
import {FileWriter} from '../../src/core/writerr';
import Transformer from '../../src/core/transformerr';
const androidTransformer = Transformer.android;
const iosTransformer = Transformer.ios;
import Line from '../../src/core/linee';

describe('Writer.getTransformedLines', () => {
    it('with android transformer should return xml', () => {
        const writer = new FileWriter();
        const result = writer.getTransformedLines([new Line('key', 'value'), new Line('// commentaire'), new Line('key2', 'value2')], androidTransformer);

        assert.equal('    <string name="key">value</string>' + EOL + '    <!-- commentaire -->' + EOL + '    <string name="key2">value2</string>', result);
    });
    
    it('with ios transformer should return in format', () => {
        const writer = new FileWriter();
        const result = writer.getTransformedLines([new Line('key', 'value'), new Line('# commentaire'), new Line('key2', 'value2')], iosTransformer);

        assert.equal('"key" = "value";' + EOL + '// commentaire' + EOL + '"key2" = "value2";', result);    
    });
});
