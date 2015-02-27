/**
 * Created by terrence on 2/26/15.
 */
var expect = require("chai").expect;
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var chai = require("chai");
chai.use(sinonChai);
var proxyquire = require("proxyquire");

describe("interpolator service", function(){

    beforeEach(function(){

        this.fsStub = sinon.stub();
        this.fsStub.returns(JSON.stringify([
            {
                "name": "Smith",
                "age": 21
            },
            {
                "name": "Jones",
                "age": 25
                
            }
        ]));

        this.interpolator = proxyquire("../index.js", {fs: {
            readFileSync: this.fsStub
            
        }});

    });

    describe("parse method - default options", function(){

        it("should, given a string of JSON with no interpolation, return that string of JSON unmodified", function(){
            var str = JSON.stringify({
                "name": "Terrence",
                "hobbies": ["sleeping", "eating", "programming"]
            });
            var result = this.interpolator.parse(str);
            expect(result).to.equal(str);
        });



        it("should, given a string of JSON with the import directive, return a modified JSON string", function(){
            var str = JSON.stringify({
                "name": "Terrence",
                "hobbies": ["sleeping", "eating", "programming"],
                "friends": "{{ import 'friends.json' }}"
            });

            var result = this.interpolator.parse(str);
            expect(result.indexOf("Jones")).to.not.equal(-1);
        });
        
        it("should cache files instead of reading them twice", function(){
            var spy = sinon.spy(this.fsStub.readFileSync);

            var str = JSON.stringify([
                    {

                        "name": "Terrence",
                        "friends": "{{ import 'friends.json' }}"
                    },
                    {
                        "name": "Heather",
                        "friends": "{{ import 'friends.json' }}"

                    }
                ]
            );
            
            var result = this.interpolator.parse(str);
            expect(this.fsStub).to.have.been.calledOnce;
            
            
        });
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

});