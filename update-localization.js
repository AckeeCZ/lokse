/**
 * Created by Jakub Baierl <jakub.baierl@ackee.cz> on 19.10.2017.
 */

var Localize = require("./localize.js");
var program = require('commander');
var path = require('path');
var _ = require('lodash');
var Ackeefile = require(path.join(
    process.cwd(), ".ackeeconfig"
));

program
//.version('0.1.0')
.description('example: ackee-localize-spreadsheet-sdk -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk -d locales/ -c cz,en,fr')
.option('-i, --id [value]', 'Spreadsheet ID')
.option('-d, --dir [value]', 'Out folder')
.option('-c, --cols [value]', 'Translation collumns')
.option('-t, --type [value]', 'Type (key_web, key_android, key_ios)')
.parse(process.argv);

const sheetID = program.id || _.get(Ackeefile, 'localization.sheet_id', false);
const dir = program.dir || _.get(Ackeefile, 'localization.dir', false);
const cols = program.cols || _.get(Ackeefile, 'localization.cols', false);
const type = program.type || _.get(Ackeefile, 'localization.type', false);

if (!sheetID || sheetID == true) {
    console.log("No spreadsheet ID given. Try -h to see a help.");
    return;
}
else{
    // Google Spreadsheet ID / sheet name
    var transformer = Localize.fromGoogleSpreadsheet(sheetID, '*');
}
if (!dir || dir == true) {
    console.log("No folder given. Try -h to see a help.");
    return;
}
if (!cols || cols == true) {
    console.log("No locale columns given. Try -h to see a help.");
    return;
}
if (!type || type == true) {
    console.log("No type given. Default type (key_web) set. Try -h to see a help.");
    type = 'key_web';
}

// Key for web
transformer.setKeyCol(type);

// Web
if(type == 'key_web'){
    let translations = cols.split(',');
    translations.map(item => {
        let filePath = path.join(
            process.cwd(), dir, item.toLowerCase()+".json"
        );
        transformer.save(filePath, { valueCol: item.toUpperCase(), format: "web" })
    });
}

// ANDROID
if(type == 'key_android'){
    let translations = cols.split(',');
    translations.map(item => {
        let filePath = path.join(
            process.cwd(), dir, "values-"+item.toLowerCase(), "strings.xml"
        );
        // Android - support <plurals> tag
        transformer.save(filePath, { valueCol: item.toUpperCase(), format: "android" });
    });
}

// iOS
if(type == 'key_ios'){
    let translations = cols.split(',');
    translations.map(item => {
        let filePath = path.join(
            process.cwd(), dir, item.toLowerCase()+".lproj", "Localizable.strings"
        );
        transformer.save(filePath, { valueCol: item.toUpperCase(), format: "ios" });
    });
}