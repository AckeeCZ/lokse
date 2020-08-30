var fs = require('fs');
var EOL = require('os').EOL;

var Writer = function () {

};

Writer.prototype.write = function (filePath, lines, transformer) {

};


var FileWriter = function () {
};

FileWriter.prototype.write = function (filePath, encoding, lines, transformer, options) {
    var fileContent = '';
    if (fs.existsSync(filePath)) {
        fileContent = fs.readFileSync(filePath, encoding);
    }

    var valueToInsert = this.getTransformedLines(lines, transformer);

    var output = transformer.insert(fileContent, valueToInsert, options);

    writeFileAndCreateDirectoriesSync(filePath, output, 'utf8');
};

//https://gist.github.com/jrajav/4140206
var writeFileAndCreateDirectoriesSync = function (filepath, content, encoding) {
    var mkpath = require('mkpath');
    var path = require('path');

    var dirname = path.dirname(filepath);
    mkpath.sync(dirname);

    fs.writeFileSync(filepath, content, encoding);
};

FileWriter.prototype.getTransformedLines = function (lines, transformer) {
    var valueToInsert = '';
    var plurals = [];
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (!line.isEmpty()) {
            if (line.isComment()) {
                valueToInsert += transformer.transformComment(line.getComment());
            } else {
                if (line.isPlural()) {
                    if (!plurals[line.getKey()]) {
                        plurals[line.getKey()] = [];
                    }
                    plurals[line.getKey()].push(line);
                } else {
                    valueToInsert += transformer.transformKeyValue(line.getKey(), line.getValue());
                }
            }
        }
        if (line.getKey() != '' && !line.isPlural() && (i != lines.length - 1 || Object.keys(plurals).length)) {
            valueToInsert += EOL;
        }
    }

    var j = 0;
    for (var plural in plurals) {
        valueToInsert += transformer.transformPluralsValues(plural, plurals[plural]);
        if (j != Object.keys(plurals).length - 1) {
            valueToInsert += EOL;
        }
        j++;
    }

    return valueToInsert;
}

var FakeWriter = function () {

};

FakeWriter.prototype.write = function (filePath, lines, transformer) {

};

module.exports = { File: FileWriter, Fake: FakeWriter };
