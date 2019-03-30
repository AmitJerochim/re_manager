var Promise = require("bluebird");
module.exports = function(db, building_id){
    return new Promise(function(resolve, reject){
        db.connect();
        var query = "SELECT * FROM re_manager.buildings where id=" + building_id + ";";
        db.execute( query, function(err, rows, fields) {
            //if (err) throw err;
            if (err) reject();
            var building=
                {
                  "id":rows[0].id,
                  "street":rows[0].street,
                  "street_nr":rows[0].street_nr,
                  "post_code":rows[0].post_code,
                  "city":rows[0].city,
                  "total_living_area":rows[0].total_living_area,
                  "living_area_except_ground_floor":rows[0].living_area_except_ground_floor,
                  "living_area_except_business_area":rows[0].living_area_except_business_area,
                  "number_flats":rows[0].number_flats,
                  "year_of_completion":rows[0].year_of_completion
                }
            resolve(building);
        });
    });
}