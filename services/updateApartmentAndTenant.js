var path =require("path");
var Promise = require("bluebird");
var renameDocumentsPath= require("./renameDocumentsPath.js");
var getApartmentDatails= require("./getApartmentDatails.js");
module.exports=(db, req, apartment_id)=>{
    

var updatePath= function(db, req, data){
    return new Promise(function(resolve, reject){
        var oldPath =path.join("/" + data["building"].id +"_"+ data["building"].street +"_"+data["building"].street_nr , data["apartment"].id +"_Whg_Nr_"+data["apartment"].indication , data["tenant"].id +"_"+data["tenant"].name); 
        var newPath = data["building"].id +"_"+ data["building"].street +"_"+data["building"].street_nr +"/"+data["apartment"].id +"_Whg_Nr_"+req.body.apartment_indication+"/"+data["tenant"].id +"_"+req.body.tenant_name;
        renameDocumentsPath(oldPath, newPath);
        resolve();
    });
};

     
var updateApartment= function(db, req){
    return new Promise(function(resolve, reject){
        var query = "UPDATE re_manager.apartments SET apartment_indication="+req.body.apartment_indication + " ,apartment_size="+ req.body.apartment_size + " ,floor=" + req.body.apartment_floor+ " ,taxes=" + req.body.apartment_taxes+" WHERE id="+ apartment_id +";";
        db.connect();
        db.execute(query, function(err, result) {
            if(err) throw err;
            resolve();
        });
    });
};

var updateTenant= function(db, req, tenant_id){
    return new Promise(function(resolve, reject){
        var query= "UPDATE re_manager.tenants SET name='"+req.body.tenant_name+"' ,net_cold_rent="+req.body.net_cold_rent+" ,property_charges="+req.body.property_charges+ " ,beginning_rental_period='"+req.body.beginning_rental_period+ "' WHERE id="+tenant_id+";";
        db.connect();
        db.execute(query, function(err, result) {
            if(err) throw err;
            resolve();
        });
    });
};    
   
  
    Promise.resolve( getApartmentDatails(db, apartment_id) ).then((data)=>{
        Promise.all([
            updatePath(db, req, data), 
            updateApartment(db, req), 
            updateTenant(db, req, data["tenant"].id)
            ]);
    });
      
};