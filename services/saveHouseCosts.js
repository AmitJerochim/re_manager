
module.exports = function(db, building_id, year, costs, titles, allocatable, distributor_key, callback){
    var get_house_cost_type_id = function(titles, index) { 
        return new Promise(function(resolve, reject){
            var type;
            var query = "SELECT id FROM re_manager.house_cost_types WHERE designation='"+titles[index]+"';";
            db.execute(query, function(err, result) {
              if (err) throw err;
              var type = result[0].id;
              resolve(type);
            });
        });
    }
    var insert_house_cost = function(type, building_id, year, costs, allocatable, distributor_key, index){
        return new Promise(function(resolve, reject){
          var query = "INSERT INTO re_manager.house_costs( type, building_id, year, allocatable, distributor_key, costs)VALUES("+type+", "+building_id+ ", "+year+ ", "+ allocatable[index] +", '"+ distributor_key[index] +"', "+ costs[index]+ ");";
          db.execute(query,function(err) {
            if (err) throw err;
            resolve(index);
          });
        });
    }
    var insert_values_loop = function(building_id, year, costs, titles, allocatable, distributor_key, i){
        return new Promise(function(resolve, reject){
              if(i<titles.length){
                resolve(i);
              }
        })
        .then(function(i){
            return new Promise(function(resolve, reject){
                get_house_cost_type_id(titles, i)
                .then(function(type){
                    insert_house_cost(type, building_id, year, costs, allocatable, distributor_key, i)
                        .then(function(i){
                            i++;
                            if( i < titles.length){
                            insert_values_loop(building_id, year, costs, titles, allocatable, distributor_key, i);
                            }
                            resolve();
                        });
                     });
            });
        });
    }
    Promise.resolve( insert_values_loop(building_id, year, costs, titles, allocatable, distributor_key, 0) ).then(callback);
}



          