/**
 * Created by terrence on 2/26/15.
 */
var expect = require("chai").expect;
var proxyquire = require("proxyquire");
describe("interpolator service parse method", function(){

    beforeEach(function(){
        this.interpolator = proxyquire("../lib/interpolate.js", {
            fs: {
                readFileSync: function(){
                    return JSON.stringify([
                        {
                            name: "Jones",
                            age: 21
                        },
                        {
                            name: "Smith",
                            age: 24
                        }
                    ]);
                }
            }
        })
    });

    it("should, given a string of JSON with no interpolation, return that string of JSON unmodified", function(){
        var str = JSON.stringify({
            "name": "Terrence",
            "hobbies": ["sleeping", "eating", "programming"]
        });
        var result = this.interpolator.parse(str);
        expect(result).to.equal(str);
    });

    describe("removeQuotes method", function(){
       it("should, given a JSON string with interpolation marks, remove the quotation marks around the interpolation marks", function(){
          var str = JSON.stringify({
              "name": "Terrence",
              "hobbies": "{{hobbies}}"
          });

          var result = this.interpolator.removeQuotes(str);
           expect(result).to.not.equal(str);
           expect(result.indexOf('"{{hobbies}"')).to.equal(-1);     //no quotes
           expect(result.indexOf("}}}")).to.equal(-1);              //no triple braces, either


       });
    });


    it("should, given a string of JSON with the import directive, return a modified JSON string", function(){
       var str = JSON.stringify({
           "name": "Terrence",
           "hobbies": ["sleeping", "eating", "programming"],
           "friends": "{{ import 'friends.json' }}"
       });


       var result = this.interpolator.parse(str);
        console.log(result);
    });
});