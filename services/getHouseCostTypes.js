    
module.exports = function(db){
    return new Promise(function(resolve, reject){
        var costTypes=[];
        db.connect();
        var query = "SELECT * FROM re_manager.house_cost_types ORDER BY designation ASC;";
        db.execute(query, function(err, rows, fields) {
          if (err) throw err;
          for(var i=0; i<rows.length; i++){
            var type=
              {
                "id":rows[i].id,
                "designation":rows[i].designation,
              }
            costTypes.push(type);
          }
          resolve(costTypes);
        });
    });
}
    
