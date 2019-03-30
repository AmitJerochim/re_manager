var express = require("express");
var app=express();
var bodyParser= require("body-parser");
var Promise = require('promise');
const DbManager = require('./db/db_manager.js');
var createAccountingLetter = require("./services/createAccountingLetter.js");
var createAccountingLetterForFurnishedApartments = require("./services/createAccountingLetterForFurnishedApartments.js");
var getBuildings = require("./services/getBuildings.js");
var getApartmentsAndBuildingDetails = require("./services/getApartmentsAndBuildingDetails.js");
var getBuildingDetails = require("./services/getBuildingDetails.js");
var getApartmentDatails = require("./services/getApartmentDatails.js");
var getHouseCostTypes = require("./services/getHouseCostTypes.js");
var saveHouseCostType = require("./services/saveHouseCostType.js");
var saveHeatingCosts = require("./services/saveHeatingCosts.js");
var saveElectricityCosts = require("./services/saveElectricityCosts.js");
var saveCommunicationCosts = require("./services/saveCommunicationCosts.js");
var saveApartment = require("./services/saveApartment.js");
var saveTenant = require("./services/saveTenant.js");
var saveHouseCosts = require("./services/saveHouseCosts.js");
var updateBuilding =require("./services/updateBuilding.js");



app.use("/ressources", express.static(__dirname + "/ressources"));
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'pug');
app.use(bodyParser.json());

var db = new DbManager();
db.createDBIfNotExists();


// //
// //
// //
// var DDLQueries= require("./db/migration2.js");
// var ddlQueries = new DDLQueries();
// var string=ddlQueries.CREATE_TABLE_BUILDINGS();
// console.log(string);
db.createTestDBIfNotExists();
// db.execute(string, function(err, rows, fields) {
//     if(err) throw err;
//     var tenant = 
//       {
//       "id":rows[0].id,
//       "name":rows[0].name,
//       "apartment_id":rows[0].apartment_id,
//       "net_cold_rent":rows[0].net_cold_rent,
//       "property_charges":rows[0].property_charges,
//       "current_tenant":rows[0].Current_tenant,
//       "beginning_rental_period":rows[0].beginning_rental_period,
//       "end_rental_period":rows[0].end_rental_period,
//       };
//   console.log(tenant);
// });
//
//
//


app.get("/impressum", function(req, res) {
    res.render("general/impressum");
});

app.get("/datenschutzerklaerung", function(req, res) {
    res.render("general/datenschutzerklaerung");
});
// redirect to /buildings
app.get("/", function(req, res){
  res.redirect("/buildings");
});

//get index
app.get("/buildings", function(req, res){
  Promise.resolve( getBuildings(db) )
  .then(function(buildings){ res.render('buildings/index', {"buildings":buildings}); });
});


//get create-Formular
app.get("/buildings/create", function(req, res){
    res.render('buildings/create');
});

//Store a new building
app.post("/buildings/store", function(req, res){
    db.connect();
    var query = "INSERT INTO re_manager.buildings(street, street_nr, post_code, city, total_living_area, living_area_except_ground_floor, living_area_except_business_area, number_flats, year_of_completion) values('"+ req.body.street +"', '"+ req.body.street_nr +"' ,"+req.body.post_code+", '"+ req.body.city+"', "+ req.body.total_living_area+","+ req.body.living_area_except_ground_floor +","+ req.body.living_area_except_business_area +","+ req.body.number_flats +","+ req.body.year_of_completion+");"
    db.execute( query, function(err) {
      if (err) throw err;
    });
  res.redirect("/buildings");
});

//index all house Cost types
app.get('/buildings/cost_types', function(req, res){
  Promise.resolve( getHouseCostTypes(db) ).then(function(costTypes) {
      res.render('buildings/cost_types', {"costTypes":costTypes});
  });
});

//show detailed view
app.get("/buildings/:id", function(req, res){
  var building_id =req.params.id;
  Promise.resolve( getApartmentsAndBuildingDetails(db, building_id) )
  .then(function(data){ res.render('buildings/show', {"data":data}); })
});

//get edit-Formular
app.get("/buildings/:id/edit", function(req, res){
  var building_id =req.params.id;
  Promise.resolve( getBuildingDetails(db, building_id) )
  .then(function(building){ res.render('buildings/edit', {"building":building}); });
});

var renameDocumentsPath= require("./services/renameDocumentsPath.js");

app.put("/buildings/:id", function(req,res){
      var building_id= req.body.id;
    // getBuildingDetails(db, building_id).then( (oldDetails)=>{
    // var oldPath = building_id +"_"+oldDetails.street+"_"+oldDetails.street_nr;
    // var newPath = building_id +"_"+ req.body.street+"_"+ req.body.street_nr;
    // renameDocumentsPath(oldPath, newPath);
    // });
  updateBuilding(db, req).then(function(){
    res.redirect(303, "/buildings/" + req.params.id);
  });
});

//get delete formular
app.get("/buildings/:id/delete", function(req, res){
  var building_id =req.params.id;
  Promise.resolve( getBuildingDetails(db, building_id) )
  .then(function(building){ res.render('buildings/delete', {"building":building}); });
});

//Delete a Building
app.delete("/buildings/:id", function(req, res){
  db.connect();
  var query = "DELETE FROM re_manager.buildings where id=" + req.params.id + ";";
  db.execute( query, function(err, rows, fields) {
    if (err) throw err;
    res.send("deleted");
  });
});


//CREATE HOUSE COSTS
app.get("/buildings/:id/add_costs", function(req, res) {
  var building_id = req.query.building_id;
    Promise.resolve( getHouseCostTypes(db) ).then(function(costTypes) {
      //res.json(costTypes)
     res.render("buildings/add_costs", {"house_cost_types":costTypes,"building_id":building_id});
  });
});

//send house_cost_types as json
app.get("/house_cost_types_json", function(req, res) {
  Promise.resolve( getHouseCostTypes(db) ).then(function(costTypes) {
     res.json(costTypes)
  });  
});

//Store house_costs
app.post("/buildings/:id/add_costs", function(req, res){
  var titles = req.body.cost_positions.titles;
  var year = req.body.year;
  var building_id = req.body.building_id;
  var costs = req.body.cost_positions.costs;
  var allocatable = req.body.cost_positions.allocatable;
  var distributor_key = req.body.cost_positions.distributor_key;
  saveHouseCosts(db, building_id, year, costs, titles, allocatable, distributor_key, function(){
    res.redirect("/buildings/"+ building_id);
  });
});

//create an apartment
app.get("/apartments/create", function(req, res) {
  res.render('apartments/create', {"building_id":req.query.building_id});
});

//store an apartment
app.post("/apartments/store", function(req, res){
  var building_id = req.body.building_id;
  var is_rented = req.body.is_rented;
  var apartment_indication= req.body.apartment_indication;
  var apartment_size= req.body.apartment_size;
  var floor= req.body.apartment_floor;
  var apartment_taxes= req.body.apartment_taxes;
  var tenant_name= req.body.tenant_name;
  var net_cold_rent= req.body.net_cold_rent;
  var property_charges =req.body.property_charges;1
  var current_tenant= req.body.current_tenant;
  var beginning_rental_period =req.body.beginning_rental_period;
  
  Promise.resolve( saveApartment(db, building_id, apartment_indication, apartment_size, floor, apartment_taxes) ).then(function(apartment_id) {
    if(is_rented==1){
    Promise.resolve( saveTenant(db, tenant_name, apartment_id, net_cold_rent, property_charges, current_tenant, beginning_rental_period) ).then(function(data) {
      res.redirect("/buildings/" + building_id);  
    });
    }else{res.redirect("/buildings/" + building_id);  }
  });
});

//get detailed view for an apartment
app.get("/apartments/:id", function(req, res) {
  Promise.resolve(getApartmentDatails(db, req.params.id)).then((data)=>{
    var building=data.building;
    var apartment=data.apartment;
    var tenant = data.tenant;
    res.render("apartments/show", {"tenant":tenant,"building":building, "apartment":apartment});
  });
});

app.get("/apartments/:id/edit", function(req, res){
  getApartmentDatails(db, req.params.id).then((data)=>{
    var apartment=data.apartment;
    var tenant = data.tenant;
    res.render( "apartments/edit", {"apartment":apartment, "tenant":tenant});
  });
});

var path =require("path");
var updateApartmentAndTenant=require("./services/updateApartmentAndTenant.js");
app.put("/apartments/:id", (req, res)=>{
  var apartment_id= req.params.id; 
  Promise.resolve(updateApartmentAndTenant(db, req, apartment_id)).then(()=>{
    res.redirect(303, "/apartments/" + apartment_id);
  }
    );
});

app.post("/apartments/:id/heating_costs", function(req, res) {
  var apartment_id = req.params.id;
  var year =req.body.year;
  var costs =req.body.heating_costs;
  Promise.resolve( saveHeatingCosts(db, apartment_id, year, costs) ).then(function() {
    res.redirect("/apartments/"+apartment_id);    
  });
});


app.post("/apartments/:id/electricity_costs", function(req, res) {
  var apartment_id = req.params.id;
  var year =req.body.year;
  var costs =req.body.electricity_costs;
  Promise.resolve( saveElectricityCosts(db, apartment_id, year, costs) ).then(function() {
    res.redirect("/apartments/"+apartment_id);    
  });
});

app.post("/apartments/:id/communication_costs", function(req, res) {
  var apartment_id = req.params.id;
  var year =req.body.year;
  var costs =req.body.communication_costs;
  Promise.resolve( saveCommunicationCosts(db, apartment_id, year, costs) ).then(function() {
    res.redirect("/apartments/"+apartment_id);    
  });
});

app.get("/tenants/:id/property_charges_accounting", function(req, res) {
  createAccountingLetter(db, req, res);
});
                      
app.get("/tenants/:id/property_charges_accounting_for_furnished_apartment", function(req, res) {
  createAccountingLetterForFurnishedApartments(db, req, res);
});


app.get("/buildings/cost_positions/create", function(req, res) {
   res.render("buildings/add_cost_types"); 
});

app.post("/buildings/add_cost_types", function(req, res){
  Promise.resolve( saveHouseCostType(db, req.body.house_cost_type) ).then(function(){
    res.redirect("/buildings");
  });
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
