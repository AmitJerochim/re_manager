var getBuildingDetails = require("./getBuildingDetails.js")
var helperFunctions =require("./helperFunctions.js")
var Promise= require("bluebird");
var functions= new helperFunctions();
var get_apartment_by_id = functions.get_apartment_by_id;
var get_building_by_id = functions.get_building_by_id;
var get_tenant_by_id = functions.get_tenant_by_id;

module.exports = function(db, apartment_id){
    var data = [];
    return new Promise(function(resolve){
        resolve(get_apartment_by_id(db, apartment_id, data));
        })
        .then((data)=>{
            return new Promise(function(resolve){
            resolve(get_tenant_by_id(db, data["apartment"].tenant_id, data));
            })
            .then((data)=>{
                return new Promise(function(resolve){
                resolve(get_building_by_id(db, data["apartment"].building_id, data));
            })
            .then(function(data){
                return new Promise(function(resolve){
                    if(typeof(data["tenant"])!="object"){
                        var tenant = 
                        {
                          "id":"",
                          "name":"",
                          "net_cold_rent":"",
                          "property_charges":"",
                          "beginning_rental_period":"",
                        };
                        data["tenant"]=tenant;
                    }
                    resolve(data);
                });
            });    
        });    
    });
}