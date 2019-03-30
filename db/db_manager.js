var Migration = require("./migration.js");
var Promise =require('promise');
var mysql= require("mysql");
var init = require("./init.js");
var DDLPaths = require("./ddl_paths.js");
var shell = require("shelljs");
var DbManager = function(){
  
  var db_config = {
    host     : 'localhost',
    user     : 'root',
    password : '' 
  }
  
  this.connection = mysql.createConnection(db_config);
  
  this.connect = function(){
    if(this.isConnected===false){
      this.connection.connect();
    }
  }
  
  this.disconnect = function(){
    this.connection.end();
  }
  
  this.isConnected = function (){
    if(this.connection.state === 'disconnected'){
      return false; 
    }else{ 
      return true;
    }
  }
  
  this.execute = function(query, callback){
    this.connection.query(query, callback);
  }



  this.migrate =function (){
    var db = this;
    var migration = new Migration();
    Promise.resolve(db.connect()).then(()=>{
      console.log("connected to database");
      Promise.all(
        [
          db.execute(migration.CREATE_TABLE_BUILDINGS, function(err){ if (err) throw err; }),        
          db.execute(migration.CREATE_TABLE_APARMENTS, function(err){ if (err) throw err; }),        
          db.execute(migration.CREATE_TABLE_TENANTS, function(err){ if (err) throw err; }),        
          db.execute(migration.CREATE_TABLE_HOUSE_COST_TYPES, function(err){ if (err) throw err; }),        
          db.execute(migration.CREATE_TABLE_HOUSE_COSTS, function(err){ if (err) throw err; }),
          db.execute(migration.CREATE_TABLE_APARTMENT_HEATING_COSTS, function(err){ if (err) throw err; }),
          db.execute(migration.CREATE_TABLE_APARTMENT_ELECTRICITY_COSTS, function(err){ if (err) throw err; }),
          db.execute(migration.CREATE_TABLE_APARTMENT_COMMUNICATION_COSTS, function(err){ if (err) throw err; })
        ]).then( ()=>{
          console.log("created tables");
      Promise.all(
        [
          db.execute(migration.ADD_FK_APARMENTS_BUILDINGS, function(err){ if (err) throw err; }),        
          db.execute(migration.ADD_FK_APARMENTS_TENANTS, function(err){ if (err) throw err; }),        
          db.execute(migration.ADD_FK_TENANTS_APARMENTS, function(err){ if (err) throw err; }),        
          db.execute(migration.ADD_FK_HOUSE_COSTS_BUILDINGS, function(err){ if (err) throw err; }),        
          db.execute(migration.ADD_FK_HOUSE_COSTS_HOUSE_COST_TYPES, function(err){ if (err) throw err; }),
          db.execute(migration.ADD_FK_APARTMENT_HEATING_COSTS_APARTMENTS, function(err){ if (err) throw err; }),
          db.execute(migration.ADD_FK_APARTMENT_ELECTRICITY_COSTS_APARTMENTS, function(err){ if (err) throw err; }),
          db.execute(migration.ADD_FK_APARTMENT_COMMUNICATION_COSTS_APARTMENTS, function(err){ if (err) throw err; }),
        ]).then(()=>{
          console.log("added foreign Keys");
        });    
      });
    });
    
  }
  this.shell_exec = function(path){
    console.log(path);
    shell.exec("mysql -u "+ db_config.user + " --password='" + db_config.password +"' < '" + path+ "'");
  }
  this.migrate_future =function (){
    var db = this;
    var queries = new DDLPaths();
    Promise.resolve(db.connect()).then(()=>{
      console.log("connected to database");
      Promise.all(
        [
          db.shell_exec(queries.CREATE_TABLE_BUILDINGS),
          db.shell_exec(queries.CREATE_TABLE_APARTMENTS),
          db.shell_exec(queries.CREATE_TABLE_CUSTOMERS),
          db.shell_exec(queries.CREATE_TABLE_TENANTS),
          db.shell_exec(queries.CREATE_TABLE_OWNERS),
          db.shell_exec(queries.CREATE_TABLE_OWNED_BY),
          db.shell_exec(queries.CREATE_TABLE_RENTED),
          db.shell_exec(queries.CREATE_TABLE_OWNER_COMMUNITIES),
          db.shell_exec(queries.CREATE_TABLE_APARTMENT_COSTS),
        ]).then( ()=>{
      console.log("created tables");
      Promise.all(
        [
          db.shell_exec(queries.BUILDINGS_CHECK_INTEGRITY),
          db.shell_exec(queries.APARTMENTS_CHECK_INTEGRITY),
          db.shell_exec(queries.CUSTOMERS_CHECK_INTEGRITY),
          
        ]).then(()=>{
      console.log("created Procedures");
      Promise.all(
        [
          db.shell_exec(queries.BUILDINGS_BEFORE_INSERT),
          db.shell_exec(queries.BUILDINGS_BEFORE_UPDATE),
          db.shell_exec(queries.APARTMENTS_BEFORE_INSERT),
          db.shell_exec(queries.APARTMENTS_BEFORE_UPDATE),
          db.shell_exec(queries.CUSTOMERS_BEFORE_INSERT),
          db.shell_exec(queries.CUSTOMERS_BEFORE_UPDATE),

        ]).then(()=>{
      console.log("created trigger");
      Promise.all(
        [
          db.shell_exec(queries.ADD_FK_APARMENTS_BUILDINGS),
          db.shell_exec(queries.ADD_FK_TENANTS_CUSTOMERS),
          db.shell_exec(queries.ADD_FK_OWNERS_CUSTOMERS),
          db.shell_exec(queries.ADD_FK_BUILDINGS_OWNER_COMMUNITIES),
          db.shell_exec(queries.ADD_FK_RENTED_APARTMENTS),
          db.shell_exec(queries.ADD_FK_RENTED_TENANTS),
          db.shell_exec(queries.ADD_FK_OWNED_BY_APARTMENTS),
          db.shell_exec(queries.ADD_FK_OWNED_BY_OWNERS),
          db.shell_exec(queries.ADD_FK_APARMENT_COSTS_APARMENTS),
          
        ]).then(()=>{
      console.log("added foreign Keys");

        });    
        });            
        });    
      });
    });
  }
  
  this.addValues = function(){
    var db=this;
    var queries= init.queries;
    for (var i = 0; i < queries.length; i++) {
      db.execute(queries[i], function(err){ if (err) throw err;});
    }
  }
  
    this.createTestDBIfNotExists = function(){
    var db=this;
    var query="SELECT count(SCHEMA_NAME) AS occurs FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'testdb';"
    
    return new Promise(function(resolve, reject){
      resolve(db.connect());
    }).then(()=>{
      return new Promise((resolve,reject)=>{
        db.execute(query, (err, rows, fields)=>{
          if (err) throw err;
          resolve(rows[0].occurs);
        })
      }).then((occurs)=>{
        if(occurs==0){
          db.execute("CREATE DATABASE testdb", (err)=>{
            if (err) throw err;
            console.log("created database testdb")
            return new Promise((resolve,reject)=>{
              resolve(db.migrate_future());
            }).then(()=>{
              console.log("migrated tables and foreign keys");
              setTimeout(()=>{
                db.execute("insert into testdb.owner_communities(name)values('WEG Bundesallee 182/Prinzregentenstr 18');", (err)=>{if (err) throw err; console.log("created WEG");});
                db.execute("insert into testdb.customers(first_name, last_name, care_of, street, street_nr, post_code, city, country, is_owner, is_tenant)values ( 'Charlotte', 'Braasch', 'Rfggf', 'Bundesallee', '182', '19829' , 'Berlin', 1, 0, 0);", (err)=>{if (err) throw err; console.log("created customer");});
                db.execute("insert into testdb.buildings(street, street_nr, post_code, city, total_area, ground_floor_area, business_area, number_flats, year_of_completion, owner_community_id)values('Bundesallee', '182', '10293', 'Berlin', 2202, 44, 233, 23, 1923, 1);", (err)=>{if (err) throw err; console.log("created building");});
                db.execute("insert into testdb.apartments(apartment_indication, building_id, apartment_size, floor)values(22, 1, 43.45, 5);", (err)=>{if (err) throw err; console.log("created apartment");});
                // db.execute("drop database testdb;", (err)=>{if (err) throw err; console.log("dropped database testdb");});
              },1000);
              
            })
          })
        }
        
      })
    }) 
  }
  
  this.createDBIfNotExists = function(){
    var db=this;
    var query="SELECT count(SCHEMA_NAME) AS occurs FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 're_manager';"
    
    return new Promise(function(resolve, reject){
      resolve(db.connect());
    }).then(()=>{
      return new Promise((resolve,reject)=>{
        db.execute(query, (err, rows, fields)=>{
          if (err) throw err;
          resolve(rows[0].occurs);
        })
      }).then((occurs)=>{
        if(occurs==0){
          db.execute("CREATE DATABASE re_manager", (err)=>{
            if (err) throw err;
            console.log("created database re_manager")
            return new Promise((resolve,reject)=>{
              resolve(db.migrate());
            }).then(()=>{
              console.log("migrated tables and foreign keys");
              setTimeout(()=>{
                db.addValues();
                console.log("add initial Values to database");
              },1000);
            })
          })
        }
        
      })
    }) 
  }
  
  
  
}

module.exports = DbManager;