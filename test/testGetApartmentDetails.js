const assert = require("chai").assert;
const getApartmentDatails= require("../services/getApartmentDatails.js");
const DbManager =require("../db/db_manager.js");

describe("getApartmentDatails", function(){
    var db = new DbManager();
    var apartment_id=8;
    
    it("getApartmentDatails should return type array", function(done){
        getApartmentDatails(db, apartment_id).then((result)=>{
            assert.typeOf(result, "array");
        }).finally(done);
    });
    
    it("getApartmentDatails should return the building with the right id", function(done){
        getApartmentDatails(db, apartment_id).then((data)=>{
            var result = data["apartment"];
            assert.typeOf(result, "object");
        }).finally(done);
    });
    
        it("getApartmentDatails should return the building with the right id", function(done){
        getApartmentDatails(db, apartment_id).then((data)=>{
            var result = data["tenant"];
            assert.typeOf(result, "object");
        }).finally(done);
    });
});