    
module.exports = function(db, house_cost_type){
  return new Promise(function(resolve, reject){
    db.connect();
    var query = "SELECT count(*) AS occurs FROM re_manager.house_cost_types WHERE designation='"+house_cost_type+"';";
    db.execute(query, function(err, rows, fields) {
      if (err) throw err;
      resolve(rows[0].occurs);
    });
  }).then(function(occurs){
       return new Promise(function(resolve, reject){
         if(occurs==0){
            var query = "INSERT INTO re_manager.house_cost_types(designation) values('"+  house_cost_type +"');"
            db.execute( query, function(err) {
              if (err) throw err;
              resolve();
            });          
         }else{resolve();}
       });
    });
}
    


