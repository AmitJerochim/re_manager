const assert = require("chai").assert;
const getBuildings= require("../services/getBuildings.js");
const DbManager =require("../db/db_manager.js");

describe("getBuildings", function(){
    it("getBuildings should return type array", function(){
        var db = new DbManager();
        assert.typeOf(getBuildings(db), "object");
    });
});