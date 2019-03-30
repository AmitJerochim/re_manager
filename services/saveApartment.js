  
module.exports = function(db, building_id, apartment_indication, apartment_size, floor, apartment_taxes){
  return new Promise(function(resolve, reject){
     db.connect();
      var query = "INSERT INTO re_manager.apartments(building_id, apartment_indication, apartment_size, floor, taxes)values(" + building_id + ", '" + apartment_indication + "', "+ apartment_size + ", "+ floor+ ", "+ apartment_taxes +");";
      db.execute(query, function(err) {
        if (err) throw err;
        query = "select id from re_manager.apartments order by id desc limit 1;"  
        db.execute(query, function(err, result) {
            if (err) throw err;
            var apartment_id=result[0].id;
            resolve(apartment_id);    
         });
      });
  });
}
    


