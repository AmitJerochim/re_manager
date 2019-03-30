const assert = require("chai").assert;
const getBuildingDetails= require("../services/getBuildingDetails.js");
const DbManager =require("../db/db_manager.js");

describe("getBuildingDetails", function(){
    var db = new DbManager();
    var building_id=4
    
    it("getBuildingDetails should return type object", function(done){
        getBuildingDetails(db, building_id).then((result)=>{
            assert.typeOf(result, "object");
        }).finally(done);
    });
    
    it("getBuildingDetails should return the building with the right id", function(done){
        getBuildingDetails(db, building_id).then((building)=>{
            var result = building.id;
            assert.equal(result, building_id);
        }).finally(done);
    });
});