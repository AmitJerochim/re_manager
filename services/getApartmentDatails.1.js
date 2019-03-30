var getBuildingDetails = require("./getBuildingDetails.js")
module.exports = function(db, req){
    var data = {};
    db.connect();
    return new Promise(function(resolve, reject){
       var query = "SELECT * from re_manager.apartments WHERE apartments.id=" + req.params.id + ";";
       db.execute(query, function(err, rows, fields) {
          if(err) throw err;
          var apartment=
              {
                "id":rows[0].id,
                "building_id": rows[0].building_id,
                "indication":rows[0].apartment_indication,
                "size":rows[0].apartment_size,
                "taxes":rows[0].taxes,
                "floor":rows[0].floor
              };
          data["apartment"]=apartment;
          resolve(apartment);
       });
    })
    .then(function(apartment){
      return new Promise(function(resolve, reject){
       var query = "SELECT * from re_manager.buildings WHERE buildings.id=" + apartment.building_id + ";";
       db.execute(query, function(err, rows, fields) {
        if(err) throw err;
        var building = 
          {
            "building_id":rows[0].id,
            "street":rows[0].street,
            "street_nr":rows[0].street_nr,
            "post_code":rows[0].post_code,
            "city":rows[0].city,
            "number_flats":rows[0].number_flats,
            "year_of_completion":rows[0].year_of_completion,
            "total_living_area":rows[0].total_living_area
          };
        data["building"]=building;
        resolve(apartment);
      });
    })
    .then(function(apartment){
        return new Promise(function(resolve, reject){
          var query = "SELECT * from re_manager.tenants WHERE tenants.apartment_id=" + apartment.id+ ";";
          db.execute(query, function(err, rows, fields) {
           if(err) throw err;
           if(rows.length >0){
               var tenant = 
                {
                  "id":rows[0].id,
                  "name":rows[0].name,
                  "net_cold_rent":rows[0].net_cold_rent,
                  "property_charges":rows[0].property_charges,
                  "beginning_rental_period":rows[0].beginning_rental_period,
                };
                data["tenant"]=tenant;
            }else{
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