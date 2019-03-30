var Promise= require("bluebird");
var helperFunctions = function(){
    //tested
    this.calc_dest_key_by_total_living_area = function(accountingPeriod, apartment_size, building_size){
        return Math.round((apartment_size * accountingPeriod)*10000 / (building_size*365))/10000;
    } 
    //tested
    this.calc_dest_key_by_living_area_exept_groundfloor= function(accountingPeriod, apartment_size, building_size_except_ground_floor, floor){
        var dest_key_by_living_area_exept_groundfloor=0;
        if (floor > 0) { dest_key_by_living_area_exept_groundfloor = Math.round((apartment_size * accountingPeriod*10000) / (building_size_except_ground_floor*365))/10000 }
        return dest_key_by_living_area_exept_groundfloor;
    }
    //tested
    this.calc_dest_key_by_number_flats =function(accountingPeriod, number_flats){
        return Math.round((accountingPeriod*10000) /(number_flats *365))/10000;
    }
    
    //tested
    this.calc_dest_key_for_individual_costs =function(accountingPeriod){
        return Math.round((accountingPeriod*10000) /(365))/10000;
    }
    this.calc_dest_key_by_living_area_exept_business_area= function(accountingPeriod, apartment_size, building_size_except_business_area){
        return Math.round((apartment_size * accountingPeriod)*10000 / (building_size_except_business_area*365))/10000;
    }
    
    this.sumPartialCosts= function(dest_key, house_costs){
      var sum_partial_costs=0;
      for (var i=0; i<house_costs.length; i++){
          var partial_costs = house_costs[i].costs*dest_key;
          sum_partial_costs += Number(partial_costs);
      }
      return sum_partial_costs;
    }
              
    this.sumHouseCosts= function(house_costs){
      var sum_house_costs=0;
      for (var i=0;i<house_costs.length;i++){
          sum_house_costs += Number(house_costs[i].costs);
      }
      return sum_house_costs;
    }

   this.add_zeros = function(number){
      var num=number.toString();
      var arr= num.split('.');
      if(arr.length==1) num=num+'.';
      arr= num.split('.');
      if(arr[1].length==0) num=num+'00';
      else if (arr[1].length==1) num=num+'0';
      return num;
    }
    
   this.setAsCost = function(number){
     var add_zeros = function(number){
          var num=number.toString();
          var arr= num.split('.');
          if(arr.length==1) num=num+'.';
          arr= num.split('.');
          if(arr[1].length==0) num=num+'00';
          else if (arr[1].length==1) num=num+'0';
          return num;
    }
        number=(Math.round(number *100) /100)
         var cost= add_zeros(number);
         return cost.replace(".", ",");
         
    }
    //tested
    this.get_apartment_id_by_tenant=function(db, tenant_id){
        return new Promise(function(resolve, reject){
            var query = "SELECT apartment_id from re_manager.tenants WHERE tenants.id=" + tenant_id+ ";";
            db.execute(query, function(err, result) {
                if(err) throw err;
                var apartment_id=result[0].apartment_id;
                resolve(apartment_id);
            });
        });
    }
   //tested
   this.get_building_id_by_apartment = function(db, apartment_id){
        return new Promise(function(resolve, reject){
            var query = "SELECT building_id from re_manager.apartments WHERE apartments.id=" + apartment_id+ ";";
            db.execute(query, function(err, result) {
                if(err) throw err;
                var building_id=result[0].building_id;
                resolve(building_id);
            });
        });      
    }
    //tested
    this.get_building_by_id = function(db, building_id, data){
        return new Promise(function(resolve, reject){
            var query = "SELECT * from re_manager.buildings WHERE buildings.id=" + building_id+ ";";
            db.execute(query, function(err, rows, fields) {
                if(err) throw err;
                var building = 
                  {
                    "id":rows[0].id,
                    "street":rows[0].street,
                    "street_nr":rows[0].street_nr,
                    "post_code":rows[0].post_code,
                    "city":rows[0].city,
                    "number_flats":rows[0].number_flats,
                    "year_of_completion":rows[0].year_of_completion,
                    "total_living_area":rows[0].total_living_area,
                    "living_area_except_ground_floor":rows[0].living_area_except_ground_floor,
                    "living_area_except_business_area":rows[0].living_area_except_business_area
                  };
                data["building"]=building;
                resolve(data);
            });
        });      
    }
    //tested
    this.get_apartment_by_id = function(db, apartment_id, data){
        return new Promise(function(resolve, reject){
            var query = "SELECT * from re_manager.apartments WHERE apartments.id=" + apartment_id+ ";";
            db.execute(query, function(err, rows, fields) {
                if(err) throw err;
                var apartment = 
                  {
                    "id":rows[0].id,
                    "building_id": rows[0].building_id,
                    "indication":rows[0].apartment_indication,
                    "tenant_id": rows[0].tenant_id,
                    "size":rows[0].apartment_size,
                    "floor":rows[0].floor,
                    "taxes":rows[0].taxes
                  };
                data["apartment"]=apartment;
                resolve(data);
            });
        });      
    }
    //tested
    this.get_tenant_by_id = function(db,tenant_id, data){
        return new Promise(function(resolve, reject){
            var query = "SELECT * from re_manager.tenants WHERE tenants.id=" + tenant_id+ ";";
            db.execute(query, function(err, rows, fields) {
                if(err) throw err;
                if(rows.length >0){
                var tenant = 
                  {
                  "id":rows[0].id,
                  "name":rows[0].name,
                  "apartment_id":rows[0].apartment_id,
                  "net_cold_rent":rows[0].net_cold_rent,
                  "property_charges":rows[0].property_charges,
                  "current_tenant":rows[0].Current_tenant,
                  "beginning_rental_period":rows[0].beginning_rental_period,
                  "end_rental_period":rows[0].end_rental_period,
                  };
                data["tenant"]=tenant;
                }
                resolve(data);
            });
        });      
    }
    //tested
    this.get_house_costs = function(db, data, building_id, year, distributor_key){
        var house_costs = [];
        return new Promise(function(resolve, reject){
            var query = "SELECT * from re_manager.house_costs JOIN re_manager.house_cost_types ON house_costs.type=house_cost_types.id WHERE year="+year+" AND distributor_key='"+ distributor_key+"' AND allocatable=1 AND house_costs.building_id=" + building_id+ ";";
            db.execute(query, function(err, rows, fields) {
                if(err) throw err;
                for(var i=0; i<rows.length; i++){
                  var house_cost=
                    {
                      "type":rows[i].type,
                      "designation":rows[i].designation,
                      "year":rows[i].year,
                      "costs":rows[i].costs,
                      "allocatable":rows[i].allocatable,
                      "distributor_key":rows[i].distributor_key
                    }
                      house_costs.push(house_cost);
                    }
                    data["house_costs_distributed_by_" + distributor_key]= house_costs;
                resolve(data);
            });
      });      
    }
    //tested
    this.get_heating_costs = function(db, data, apartment_id, year){
        return new Promise( function(resolve, reject){
        var query = "SELECT * FROM re_manager.apartment_heating_costs where apartment_id=" + apartment_id + " AND year =" +year+ ";";
            db.execute(query, function(err, rows, fields) {
               if (err) throw err;
               var heating_costs = rows[0].costs;
               data["heating_costs"] = heating_costs;
               resolve(data);
            });
        });
    }

    this.get_electricity_costs = function(db, data, apartment_id, year){
        return new Promise( function(resolve, reject){
        var query = "SELECT * FROM re_manager.apartment_electricity_costs where apartment_id=" + apartment_id + " AND year =" +year+ ";";
            db.execute(query, function(err, rows, fields) {
               if (err) throw err;
               var electricity_costs = rows[0].costs;
               data["electricity_costs"] = electricity_costs;
               resolve(data);
            });
        });
    }

    this.get_communication_costs = function(db, data, apartment_id, year){
        return new Promise( function(resolve, reject){
        var query = "SELECT * FROM re_manager.apartment_communication_costs where apartment_id=" + apartment_id + " AND year =" +year+ ";";
            db.execute(query, function(err, rows, fields) {
               if (err) throw err;
               var communication_costs = rows[0].costs;
               data["communication_costs"] = communication_costs;
               resolve(data);
            });
        });
    }
    
    //tested
    this.getAccountingPeriod = function(tenant, year){
        var start_next_year =new Date(year,12,1);
        var end_last_year = new Date(year-1,11,31);
        var time_period=365;
        if (tenant.beginning_rental_period > end_last_year) { time_period = (start_next_year - tenant.beginning_rental_period)/(60*60*24*1000)}
        if (tenant.end_rental_period!='0000-00-00' && tenant.end_rental_period < start_next_year && tenant.end_rental_period > end_last_year) { time_period = (tenant.end_rental_period - end_last_year)/(60*60*24*1000)}
        if (time_period < 0) time_period=0;
        return time_period;
    }
}


module.exports = helperFunctions;