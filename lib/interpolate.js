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



var interpolator = (function(){
    var Handlebars = require("handlebars")
        , _ = require("underscore")
        , service = {}
    ;

    Handlebars.registerHelper("import", function(filename){
        var file = fs.readFileSync(filename, {encoding: "utf8"});
        return  new Handlebars.SafeString(file);
    });

    service.regexp = /"(\{\{.+?\}\})"/g;

    service.defaultOptions = {
        recursive: false,
        ignoreQuotes: false,
        cache: true,
        data: {}
    };

    service._cache = {};

    service.defaultHelpers = {
        "import": function(filename){

            var fs = require("fs"), path = require("path"), fileContents;
            filename = path.resolve(filename);
            if(!service._cache[filename]){
                fileContents = fs.readFileSync(filename, {encoding: "utf8"});

                if(service.options.cache){
                    service._cache[filename] = fileContents;
                }
            } else {
                fileContents = service._cache[filename];
            }

            return new Handlebars.SafeString(fileContents);
        }
    };

    service.registerHelper = function(helperName, helperFn){
        Handlebars.registerHelper(helperName, helperFn);
    };

    //register default helpers
    Object.keys(service.defaultHelpers).forEach(function(helperName){
       service.registerHelper(helperName, service.defaultHelpers[helperName]);
    });


    service.removeQuotes = function(text){
        return text.replace(service.regexp, " $1 ");        //put a space on either side, to avoid a series of }}}, which breaks handlebars.
    };

    service.parse = function(text, options){
        var result, template;
        options = _.defaults(options || {}, service.defaultOptions);

        service.options = options;

        if(!options.ignoreQuotes){
            //result = text.replace(service.regexp, "{{ $1 }}");            //this removes quotation marks around {{ }} handlebars markers
            text = service.removeQuotes(text);
        }

        template = Handlebars.compile(text);
        return template(options.data);
    };


    return service;
})();


module.exports = interpolator;