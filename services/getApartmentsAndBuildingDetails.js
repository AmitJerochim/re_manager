
module.exports = function(db, building_id){
    return new Promise(function(resolve, reject){
        var data=[];
        db.connect();
        var query = "SELECT buildings.id as building_id, street, street_nr, post_code, city, total_living_area, living_area_except_ground_floor, number_flats, year_of_completion, apartments.id AS apartment_id, apartment_size, tenants.name AS tenant_name, net_cold_rent, property_charges FROM re_manager.buildings LEFT JOIN re_manager.apartments ON buildings.id=apartments.building_id LEFT JOIN re_manager.tenants ON tenants.apartment_id=apartments.id where buildings.id=" + building_id + ";"
        db.execute( query, function(err, rows, fields) {
        if (err) throw err;
        for(var i=0; i<rows.length; i++){
            var apartment=
            {
              "building_id":rows[i].building_id,
              "street":rows[i].street,
              "street_nr":rows[i].street_nr,
              "post_code":rows[i].post_code,
              "city":rows[i].city,
              "total_living_area":rows[i].total_living_area,
              "living_area_except_ground_floor":rows[i].living_area_except_ground_floor,
              "number_flats":rows[i].number_flats,
              "year_of_completion":rows[i].year_of_completion,
              "apartment_id":rows[i].apartment_id,
              "apartment_size":rows[i].apartment_size,
              "tenant_name":rows[i].tenant_name,
              "net_cold_rent":rows[i].net_cold_rent,
              "property_charges":rows[i].property_charges,
            }
            data.push(apartment);
        }
            resolve(data);
        });
    });
}