var Promise = require("bluebird");
var renameDocumentsPath= require("./renameDocumentsPath.js");
var getBuildingDetails= require("./getBuildingDetails.js");
module.exports= function(db,req){
  return new Promise(function(resolve, reject){
    var building_id= req.params.id;
    getBuildingDetails(db, building_id).then( (oldDetails)=>{
      var oldPath = building_id +"_"+oldDetails.street+"_"+oldDetails.street_nr;
      var newPath = building_id +"_"+ req.body.street+"_"+ req.body.street_nr;
      renameDocumentsPath(oldPath, newPath);
    });
    
    db.connect();
    var query = "UPDATE re_manager.buildings SET street='" + req.body.street +
    "', street_nr='" + req.body.street_nr + "',post_code=" + req.body.post_code + 
    " ,city='" + req.body.city + "' ,total_living_area=" + req.body.total_living_area + 
    " ,living_area_except_ground_floor=" + req.body.living_area_except_ground_floor + 
    " ,number_flats=" + req.body.number_flats + " ,year_of_completion=" + req.body.year_of_completion + 
    " where id="+req.params.id  +";" 
    db.execute( query, function(err) {
      if (err) throw err;
      resolve();
    });    
  });
  
}
