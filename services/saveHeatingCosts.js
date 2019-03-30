    
module.exports = function(db, apartment_id, year, costs){
  return new Promise(function(resolve, reject){
    db.connect();
    var query = "DELETE FROM re_manager.apartment_heating_costs WHERE apartment_id=" + apartment_id +" AND year=" +year +";"
    db.execute(query, function(err) {
      if (err) throw err;
      query ="INSERT INTO re_manager.apartment_heating_costs( apartment_id, year, costs)values(" + apartment_id + ", " + year+ ", "+ costs +");"
      db.execute(query, function(err) {
          if (err) throw err;
          resolve();
      });
    });
  });
}
    


