const assert = require("chai").assert;
const renameDocumentsPath= require("../services/renameDocumentsPath.js");
const sinon =require("sinon");
const mock = require('mock-fs');
var fs= require("fs");
var path=require("path");
var Promise=require("bluebird");


describe("SinonFunction", function(){

    beforeEach(function() {
        var config={
            "home/ubuntu/workspace/documents/bka":{
                "1_TestStreet_13":{
                  "1_Whg_Nr_3":{
                      "1_bobik old":{
                          "2018":{
                              "2018_8_29_14_40_36_Betriebskostenabrechnung_2018.pdf": "some content",
                              "2018_8_29_15_33_36_Betriebskostenabrechnung_2018.pdf": "some content1"
                          }
                      }
                  }
                }
            }
        }
        mock(config);
    });
    
    it("SinonFunction should return type number", function(done){
        var file= path.join("home/ubuntu/workspace/documents/bka/1_TestStreet_13/1_Whg_Nr_3/1_bobik old/2018/2018_8_29_14_40_36_Betriebskostenabrechnung_2018.pdf");
        console.log("file exists: " + fs.existsSync(file));
        var text= fs.readFileSync(file, "utf-8");
        console.log("file content :" + text);
        var oldPath= path.join("1_TestStreet_13/");
        var newPath= path.join("1_TestStreet_134/");
        Promise.resolve(renameDocumentsPath(oldPath, newPath)).then(()=>{
            file= path.join("home/ubuntu/workspace/documents/bka/1_TestStreet_13/1_Whg_Nr_3/1_bobik new/2018/2018_8_29_14_40_36_Betriebskostenabrechnung_2018.pdf");
            console.log("file exists: " + fs.existsSync(file));
            var result =fs.existsSync(file);
            assert.equal(result, "true");
            
        }).finally(done);
        
    });
    
     afterEach(mock.restore); 
});