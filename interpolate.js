/**
 * Created by terrencewatson on 2/24/15.
 *
 *
 * @module An interpolation service for JSON files. Given some JSON text (NOT a JavaScript object), the service will interpolate it:
 * That is, it will substitute some other JSON for symbols grouped by {{ }} marks.
 *
 * Example:
 *
 * {
 *     "players": "{{./players.json}}",
 * }
 *
 * Note: the string-to-be-interpolated can be placed within quotation marks. The interpolator is smart enough to realize that if it is substituting a JSON array, it will need to drop the quotation marks.
 * Placing the {{ }} in quotes ensures the JSON remains valid.
 *
 * The idea is that JSON text can be run through the interpolator BEFORE being sent to JSON.parse
 *
 */

var Handlebars = require("handlebars");
var fs = require("fs");

var interpolator = (function(){
    var service = {};

    Handlebars.registerHelper("import", function(filename){
        var file = fs.readFileSync(filename, {encoding: "utf8"});
        return  new Handlebars.SafeString(file);
    });

    service.regexp = /"\{\{(.+?)\}\}"/g;


    service.parse = function(text){
      var result = text.replace(service.regexp, "{{ $1 }}");            //this removes quotation marks around {{ }} handlebars markers
        var template = Handlebars.compile(result);
        return template({});
    };


    return service;
})();


module.exports = interpolator;