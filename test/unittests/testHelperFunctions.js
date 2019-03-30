const chai = require("chai");
const assert= chai.assert;
const should =chai.should;
const sinon = require("sinon");
const Functions= require("../../services/helperFunctions.js");


var functions= new Functions;


describe("helperfunctions", function(){
    var execute;
    var connect;
    var db={
        "connect": ()=>{},
        "execute": ()=>{}
    };
    var data=[];
    var tenant=
        { 
            id: 6,
            apartment_id: 7,
            name: 'detlef',
            net_cold_rent: 668,
            property_charges: 86,
            Current_tenant: 1,
            beginning_rental_period: new Date("2019-08-15T00:00:00.000Z"),
            end_rental_period: '0000-00-00' 
        }
    
    var building = 
        {
            id:4,
            street:"Jülicher Str",
            street_nr:"3a",
            post_code:10717,
            city:"Berlin",
            number_flats: 44,
            living_area_except_ground_floor:1000,
            year_of_completion: 1908,
            total_living_area: 1363,
        };
    var apartment=
        {
            id:7,
            building_id: 3,
            indication:55,
            size:55.6,
            taxes:63.3,
            floor:6,
            };
    var year=2018;
    
    // beforeEach(function() {
    //     execute = sinon.stub(db, 'execute');
    // });
    // afterEach(function() {
    //     execute.restore();
    // });
    
    var getAccountingPeriod= functions.getAccountingPeriod;
    var calc_dest_key_by_total_living_area= functions.calc_dest_key_by_total_living_area;
    var calc_dest_key_by_living_area_exept_groundfloor = functions.calc_dest_key_by_living_area_exept_groundfloor;
    var calc_dest_key_by_number_flats = functions.calc_dest_key_by_number_flats;
    var get_apartment_id_by_tenant = functions.get_apartment_id_by_tenant;
    var get_building_by_id = functions.get_building_by_id;
    var get_building_id_by_apartment = functions.get_building_id_by_apartment;
    var get_apartment_by_id = functions.get_apartment_by_id;
    var get_tenant_by_id = functions.get_tenant_by_id;
    var get_house_costs = functions.get_house_costs;
    var get_heating_costs = functions.get_heating_costs;
    
    
    // describe("getAccountingPeriod", function(){
    //     it("getAccountingPeriod should return type number", function(){
    //         var result= getAccountingPeriod(tenant, year)
    //         assert.typeOf(result, "number");
    //     });
        
    //     it("getAccountingPeriod should be equal or bigger then 0", function(){
    //         var result= getAccountingPeriod(tenant, year)
    //         assert.isAtLeast(result, 0);
    //     });
        
    //     it("getAccountingPeriod should be equal or smaller then 365", function(){
    //         var result= getAccountingPeriod(tenant, year)
    //         assert.isAtMost(result, 365);
    //     });
    // });
    
    // describe("calc_dest_key_by_total_living_area", function(){
    //     var accountingPeriod= getAccountingPeriod(tenant, year)
    //     it("calc_dest_key_by_total_living_area should return type number", function(){
    //         var result= calc_dest_key_by_total_living_area(accountingPeriod, apartment.size, building.total_living_area)
    //         assert.typeOf(result, "number");
    //     });
    //     it("calc_dest_key_by_total_living_area should be equal or bigger then 0", function(){
    //         var result= calc_dest_key_by_total_living_area(accountingPeriod, apartment.size, building.total_living_area)
    //         assert.isAtLeast(result, 0);
    //     });
    //     it("calc_dest_key_by_total_living_area should be equal or smaller then 1", function(){
    //         var result= calc_dest_key_by_total_living_area(accountingPeriod, apartment.size, building.total_living_area)
    //       assert.isAtMost(result, 1);
    //     });
    // });
    
    // describe("calc_dest_key_by_living_area_exept_groundfloor", function(){
    //     var accountingPeriod= getAccountingPeriod(tenant, year)
    //     it("calc_dest_key_by_living_area_exept_groundfloor should return type number", function(){
    //         var result= calc_dest_key_by_living_area_exept_groundfloor(accountingPeriod, apartment.size, building.living_area_except_ground_floor, apartment.floor)
    //         assert.typeOf(result, "number");
    //     });
    //     it("calc_dest_key_by_living_area_exept_groundfloor should be equal or bigger then 0", function(){
    //         var result= calc_dest_key_by_living_area_exept_groundfloor(accountingPeriod, apartment.size, building.living_area_except_ground_floor, apartment.floor)
    //         assert.isAtLeast(result, 0);
    //     });
    //     it("calc_dest_key_by_living_area_exept_groundfloor should be equal or smaller then 1", function(){
    //         var result= calc_dest_key_by_living_area_exept_groundfloor(accountingPeriod, apartment.size, building.living_area_except_ground_floor, apartment.floor)
    //       assert.isAtMost(result, 1);
    //     });
    // });
    
    // describe("calc_dest_key_by_number_flats", function(){
    //     var accountingPeriod= getAccountingPeriod(tenant, year)
    //     it("calc_dest_key_by_number_flats should return type number", function(){
    //         var result= calc_dest_key_by_number_flats(accountingPeriod, building.number_flats)
    //         assert.typeOf(result, "number");
    //     });
    //     it("calc_dest_key_by_number_flats should be equal or bigger then 0", function(){
    //         var result= calc_dest_key_by_number_flats(accountingPeriod, building.number_flats)
    //         assert.isAtLeast(result, 0);
    //     });
    //     it("calc_dest_key_by_number_flats should be equal or smaller then 1", function(){
    //         var result= calc_dest_key_by_number_flats(accountingPeriod, building.number_flats)
    //       assert.isAtMost(result, 1);
    //     });
    // });
    
    describe("get_apartment_id_by_tenant", function(){

    });
    
        it("get_apartment_id_by_tenant should return type number", sinon.test(function(done){
            execute = this.stub(db, 'execute');
            execute.resolves(3);
            get_apartment_id_by_tenant(db, tenant.id).then((result)=>{
                assert.typeOf(result, "number");
            }).finally(done);
        }));
    
    // describe("get_building_by_id", function(){
    //     it("get_building_by_id should get an Array as Parameter and insert a building object as parameter", function(done){
    //         get_building_by_id(db, building.id, data).then((result)=>{
    //             assert.typeOf(result, "array");
    //         }).finally(done);
    //     });
    //   it("get_building_by_id should return Array with an Object in array['building']", function(done){
    //         get_building_by_id(db, building.id, data).then((result)=>{
    //             assert.typeOf(result["building"], "object");
    //         }).finally(done);
    //     });        
    // });
    
    // describe("get_building_id_by_apartment", function(){
    //     it("get_building_id_by_apartment should return type number", function(done){
    //         get_building_id_by_apartment(db, apartment.id).then((result)=>{
    //             assert.typeOf(result, "number");
    //         }).finally(done);
    //     });  
    //     it("get_building_id_by_apartment should the right building_id", function(done){
    //         get_building_id_by_apartment(db, apartment.id).then((result)=>{
    //             assert.equal(result,building.id);
    //         }).finally(done);
    //     });
    // });
    // describe("get_apartment_by_id", function(){
    //     it("get_apartment_by_id should get an Array as Parameter and insert a building object as parameter", function(done){
    //         get_apartment_by_id(db, apartment.id, data).then((result)=>{
    //             assert.typeOf(result, "array");
    //         }).finally(done);
    //     });
    //   it("get_apartment_by_id should return Array with an Object in array['apartment']", function(done){
            
    //         get_apartment_by_id(db, apartment.id, data).then((result)=>{
    //             assert.typeOf(result["apartment"], "object");
    //         }).finally(done);
    //     });        
    // });    
    // describe("get_tenant_by_id", function(){
    //     it("get_tenant_by_id should get an Array as Parameter and insert a building object as parameter", function(done){
    //         get_tenant_by_id(db, tenant.id, data).then((result)=>{
    //             assert.typeOf(result, "array");
    //         }).finally(done);
    //     });
    //   it("get_tenant_by_id should return Array with an Object in array['tenant']", function(done){
    //         get_tenant_by_id(db, tenant.id, data).then((result)=>{
    //             assert.typeOf(result["tenant"], "object");
    //         }).finally(done);
    //     });        
    // });
    // describe("get_house_costs", function(){
    //     it("get_house_costs should get an Array as Parameter and insert a building object as parameter", function(done){
    //         get_house_costs(db, data, building.id, year, "total_living_area").then((result)=>{
    //             assert.typeOf(result, "array");
    //         }).finally(done);
    //     });
    //   it("get_house_costs should return Array with an array in array['house_costs_distributed_by_total_living_area']", function(done){
    //         get_house_costs(db, data, building.id, year, "total_living_area").then((result)=>{
    //             assert.typeOf(result["house_costs_distributed_by_total_living_area"], "array");
    //         }).finally(done);
    //     });
    // });
    // describe("get_heating_costs", function(){
    //     it("get_heating_costs should get an Array as Parameter and insert a building object as parameter", function(done){
    //         get_heating_costs(db, data, apartment.id, year).then((result)=>{
    //             assert.typeOf(result, "array");
    //         }).finally(done);
    //     });
    //   it("get_heating_costs should return Array with an number in array['heating_costs']", function(done){
    //         get_heating_costs(db, data, apartment.id, year).then((result)=>{
    //             assert.typeOf(result["heating_costs"], "number");
    //         }).finally(done);
    //     });
    // });
});
