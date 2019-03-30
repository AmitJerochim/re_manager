    
module.exports = function(db, tenant_name, apartment_id, net_cold_rent, property_charges, current_tenant, beginning_rental_period){
    return new Promise(function(resolve, reject){
        db.connect();
        var query = "insert into re_manager.tenants(name, apartment_id, net_cold_rent, property_charges, current_tenant, beginning_rental_period)values('" + tenant_name + "', " + apartment_id + ", " +net_cold_rent+ ", " +property_charges+ ", " + current_tenant+ ", '" + beginning_rental_period +"');";
        db.execute(query, function(err) {
            if (err) throw err;
            resolve();
        });
    }).then(function(){
        return new Promise(function(resolve, reject){
          var query = "select id from re_manager.tenants order by id desc limit 1;";
          db.execute(query, function(err,result) {
            if (err) throw err;
            var tenant_id=result[0].id;
            resolve(tenant_id);
          });
        }).then(function(tenant_id){
            return new Promise(function(resolve, reject){
                var query = "UPDATE re_manager.apartments SET tenant_id=" +tenant_id+ " where id= "+apartment_id+";"
                db.execute(query, function(err) {
                  if (err) throw err;
                   resolve();
                });
          });
        });
    });  
}
    

