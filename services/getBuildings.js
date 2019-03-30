var Promise = require("bluebird");

module.exports = function(db){
    return new Promise(function(resolve, reject){
        var buildings=[];
        db.connect();
        //  db.migrate();
        //  db.addValues();
        var query = "SELECT * FROM re_manager.buildings;"
        db.execute(query, function(err, rows, fields) {
            //if (err) throw err;
            if (err) reject();
            for(var i=0; i<rows.length; i++){
                var building=
                    {
                     "id":rows[i].id,
                     "street":rows[i].street,
                     "street_nr":rows[i].street_nr,
                     "post_code":rows[i].post_code,
                     "city":rows[i].city,
                     "total_living_area":rows[i].total_living_area,
                     "living_area_except_ground_floor":rows[i].living_area_except_ground_floor,
                     "number_flats":rows[i].number_flats,
                     "year_of_completion":rows[i].year_of_completion
                    }
                buildings.push(building);
            }
        resolve(buildings);
        });
    });
}