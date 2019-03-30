var PDFDocument = require('pdfkit');
var shell = require('shelljs');
var fs = require('fs');
var path = require('path');
module.exports = function(db, req, res){
    var doc = new PDFDocument();
    var data ={};
    var year = req.query.year;
    var tenant_id = req.params.id;
    
    var add_zeros=function(number){
      var num=number.toString();
      var arr= num.split('.');
      if(arr.length==1) num=num+'.';
      arr= num.split('.');
      if(arr[1].length==0) num=num+'00';
      else if (arr[1].length==1) num=num+'0';
      return num;
    }
        
    var get_apartment_id = function(){
      return new Promise(function(resolve, reject){
          var query = "SELECT apartment_id from re_manager.tenants WHERE tenants.id=" + tenant_id+ ";";
          db.execute(query, function(err, result) {
           if(err) throw err;
            var apartment_id=result[0].apartment_id;
            resolve(apartment_id);
          });
      });
    }
    var get_building_id = function(apartment_id){
      return new Promise(function(resolve, reject){
          var query = "SELECT building_id from re_manager.apartments WHERE apartments.id=" + apartment_id+ ";";
          db.execute(query, function(err, result) {
           if(err) throw err;
            var building_id=result[0].building_id;
            resolve(building_id);
          });
      });      
    }
    
    var get_building = function(building_id){
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
                "living_area_except_ground_floor":rows[0].living_area_except_ground_floor
              };
           data["building"]=building;
            resolve(data);
          });
      });      
    }
    var get_apartment = function(apartment_id){
      return new Promise(function(resolve, reject){
          var query = "SELECT * from re_manager.apartments WHERE apartments.id=" + apartment_id+ ";";
          db.execute(query, function(err, rows, fields) {
           if(err) throw err;
           var apartment = 
              {
                "id":rows[0].id,
                "building_id": rows[0].building_id,
                "indication":rows[0].apartment_indication,
                "size":rows[0].apartment_size,
                "floor":rows[0].floor,
                "taxes":rows[0].taxes
              };
           data["apartment"]=apartment;
            resolve(data);
          });
      });      
    }
    
     var get_tenant = function(tenant_id){
      return new Promise(function(resolve, reject){
          var query = "SELECT * from re_manager.tenants WHERE tenants.id=" + tenant_id+ ";";
          db.execute(query, function(err, rows, fields) {
           if(err) throw err;
           var tenant = 
              {
              "id":rows[0].id,
              "name":rows[0].name,
              "net_cold_rent":rows[0].net_cold_rent,
              "property_charges":rows[0].property_charges,
              "beginning_rental_period":rows[0].beginning_rental_period,
              "end_rental_period":rows[0].end_rental_period,
              };
           data["tenant"]=tenant;
            resolve(data);
          });
      });      
    }
    
    var get_house_costs = function(building_id, year, distributor_key){
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
    
    var get_heating_costs= function(apartment_id, year){
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
    
    get_apartment_id().then(function(apartment_id){
      get_building_id(apartment_id).then(function(building_id){
        Promise.all(
          [
            get_building(building_id),
            get_apartment(apartment_id),
            get_tenant(tenant_id),
            get_heating_costs(apartment_id, year),
            get_house_costs(building_id, year, "foreign_calculation"),
            get_house_costs(building_id, year, "number_flats"),
            get_house_costs(building_id, year, "total_living_area"),
            get_house_costs(building_id, year, "living_area_except_ground_floor"),
          ])
        .then(function(){
           var tenant = data.tenant;
           var building = data.building;
           var apartment = data.apartment;
           var heating_costs = data.heating_costs;
           var house_costs_distributed_by_foreign_calculation =data.house_costs_distributed_by_foreign_calculation;
           var house_costs_distributed_by_number_flats =data.house_costs_distributed_by_number_flats;
           var house_costs_distributed_by_total_living_area =data.house_costs_distributed_by_total_living_area;
           var house_costs_distributed_by_living_area_except_ground_floor =data.house_costs_distributed_by_living_area_except_ground_floor;
           var now= new Date();
           var month= 1+now.getMonth();
           
           var start_next_year =new Date(year,12,1);
           var end_last_year = new Date(year-1,11,31);
           var time_period=365;
           if (tenant.beginning_rental_period > end_last_year) { time_period = (start_next_year - tenant.beginning_rental_period)/(60*60*24*1000)}
           if (tenant.end_rental_period!='0000-00-00' && tenant.end_rental_period < start_next_year && tenant.end_rental_period > end_last_year) { time_period = (tenant.end_rental_period - end_last_year)/(60*60*24*1000)}
           var dest_key_by_total_living_area = Math.round((apartment.size * time_period)*10000 / (building.total_living_area*365))/10000;
           var dest_key_by_living_area_exept_groundfloor=0;
           if (apartment.floor > 0) { dest_key_by_living_area_exept_groundfloor = Math.round((apartment.size * time_period*10000) / (building.living_area_except_ground_floor*365))/10000 }
           var dest_key_by_number_flats = Math.round((time_period*10000) /(building.number_flats *365))/10000;
     
           var writeStream;
         
           
           var dir=path.resolve( __dirname+"/../documents/bka/"+building.id+"_"+building.street+"_"+building.street_nr+"/"+apartment.id+"_Whg_Nr_"+apartment.indication+"/"+tenant.id+"_"+tenant.name+'/'+year);
           var fileName = now.getFullYear() + '_' + month +'_'+ now.getUTCDate() +'_'+now.getHours()+ '_' +now.getMinutes()+'_'+now.getSeconds()+ '_Betriebskostenabrechnung_'+ year + '.pdf';
           Promise.resolve(shell.mkdir("-p", dir)).then(function(){ writeStream = fs.createWriteStream( dir + '/' + fileName );            
           doc.pipe(writeStream);
           var x=doc.x;
           var y= doc.y;
           doc.on("pageAdded", function(){
             y=doc.y;
             
           });
           doc.text("Berlin, den "+ now.getUTCDate()  +"."+month + "."+now.getFullYear() , x+330, y);
           doc.text("Moran Jerochim", x, y);
           doc.text("Alemannenallee 11");
           doc.text("14052 Berlin");
           doc.y = doc.y+130;
           doc.text(tenant.name);
           doc.text(building.street+ " " + building.street_nr);
           doc.text(building.post_code + " " + building.city);
           doc.y=doc.y +50;
           doc.fontSize(16);
           doc.font('Helvetica-Bold');
           doc.text("Betriebskostenabrechnung");
           doc.moveDown();
           doc.fontSize(12);
           doc.text("Allgemeine Erläuterung zur Berechnung des Verteilerschlüssels:");
           doc.font('Helvetica');
           doc.text("Ihr Verteilerschlüssel ergibt sich aus dem Produkt ihres Anteils der Berechnungsgrundlage sowie den Zeitraum der Abrechnungsperiode, die Sie verwohnt haben dividiert durch das Produkt aus gesamten Berechnungsgrundlage und dem gesamten Zeitraum der Abrechnungsperiode");
           doc.moveDown();
      var calc=(doc, x,y, dest_key, house_costs_object, calc_base, calc_partial, calc_unit)=>{
            var sum_house_costs=0;
            var sum_partial_costs=0;
            //Verteilerschluessel Tabelle
            
            y=y+15;
            if(y>600) { doc.addPage(); y=doc.y;}
            x=170;
            doc.text("Berechnungsgrundlage", x, y);
            x=x+140;
            doc.text("Zeitraum", x, y);
            x=x+100;
            doc.text("Ihr Verteilerschlüssel", x, y);
            y+=20;
            x=72;
            doc.text("Gesamt", x, y);
            
            x=170;
            doc.text(calc_base + " " + calc_unit, x, y, {width:110, align:'right'});
            x=x+140;
            doc.text("365", x, y);
            
            y+=20;
            x=72;
            doc.text("Ihr Anteil", x, y);
            x=170;
            doc.text(calc_partial + " " + calc_unit, x, y, {width:110, align:'right'});
            x=x+140;
            doc.text(time_period, x, y);  
            x=x+100;
            doc.text(dest_key.toString().replace('.',','), x, y);  
            doc.moveTo(150, y+20).lineTo(150, y-30).lineTo(550, y-30).stroke();
            y+=40;
            //table header
            
            doc.font('Helvetica-Bold').text("Ihre Kosten:", 72, y).font('Helvetica');
            y=y+30;
            x=72;
            doc.text("Bezeichnung", x, y);
            x+=200;
            doc.text("Gesamtkosten", x,y);
            x+=100;
            doc.text("Verteilerschlüssel", x, y);
            x+=120;
            doc.text("Ihr Anteil", x, y);
            //Table line
            y=y+15;
            doc.moveTo(72, y).lineTo(550, y).stroke();
            //table content
            for (var i=0;i<house_costs_object.length;i++){
                if (doc.y<y) y=doc.y;
                // doc.text(y);
                 sum_house_costs += Number(house_costs_object[i].costs);
                 var partial_costs = Math.round(house_costs_object[i].costs*dest_key*100)/100;
                 sum_partial_costs += Number(partial_costs);
                 partial_costs = add_zeros(partial_costs).replace('.',',');
                 var house_costs=add_zeros(house_costs_object[i].costs).replace('.',',');
                 y=y+15;
                 x=72;
                  
                  doc.text(house_costs_object[i].designation, x, y);
                  if (doc.y<y) y=72;
                  x+=200;
                  doc.text(house_costs, x,y, {width:80, align:'right'});
                  x+=100;
                  doc.text(dest_key.toString().replace('.',','), x, y, {width:80, align:'right'});
                  x+=100;
                  doc.text(partial_costs, x, y, {width:80, align:'right'});
                  if (doc.y<y) y=doc.y;
                  
              }
              //Table endline
            y=y+15;
            if (doc.y<y) y=doc.y;
            doc.moveTo(72,y).lineTo(550, y).stroke();
            y+=5;
            //summary
            //todo
            sum_house_costs=Math.round(sum_house_costs*100)/100;
            doc.text(add_zeros(sum_house_costs).replace('.',','), x-200,y, {width:80, align:'right'});
            if (doc.y<y) y=doc.y;
            sum_partial_costs=Math.round(sum_partial_costs*100)/100;
            doc.text(add_zeros(sum_partial_costs).replace('.',','), x,y, {width:80, align:'right'}); 
            y=y+50;
            doc.x=72;
            doc.y=y;
            return sum_partial_costs;
        }
        if(y>600) { doc.addPage(); y=doc.y;}
        doc.font('Helvetica-Bold').text("Berechnung des Verteilerschlüssels anhand der Wohnfläche:").font('Helvetica');
        doc.moveDown();
        x=doc.x;
        y= doc.y;
        
        var sum1=calc(doc, x, y, dest_key_by_total_living_area, house_costs_distributed_by_total_living_area, building.total_living_area, apartment.size, "m²" );
        if(y>600) { doc.addPage(); y=doc.y;}
        doc.font('Helvetica-Bold').text("Berechnung des Verteilerschlüssels anhand der Anzahl an Wohnungen:").font('Helvetica');
        doc.moveDown();
        x=doc.x;
        y= doc.y;
        var sum2=calc(doc, x, y, dest_key_by_number_flats, house_costs_distributed_by_number_flats, building.number_flats, "1", "Wohnheinheiten" );
        if(y>600) { doc.addPage(); y=doc.y;}
        doc.font('Helvetica-Bold').text("Berechnung des Verteilerschlüssels anhand der Wohnfläche (Außer Erdgeschoß):").font('Helvetica');
        doc.moveDown();
        x=doc.x;
        y= doc.y;
        var sum3=calc(doc, x, y, dest_key_by_living_area_exept_groundfloor, house_costs_distributed_by_living_area_except_ground_floor, building.living_area_except_ground_floor, apartment.size, "m²" );
        doc.moveDown();
        x=doc.x;
        y= doc.y;
    
        
        doc.font('Helvetica-Bold').text("Berechnung der Heizkosten:").font('Helvetica');
        doc.text("Die für jede Wohnung entstehende Heizkosten sind Verbrauchsabhängig und werden für das gesamte Abrechnungsjahr ermittelt. Die Verbrauchswerte werden mittels Heizkostenverteiler gemessen. Die Ablesung dieser Verbrauchswerte und die Berechnung der Heizkosten für das gesamte Abrechnungsjahr werden von einen externen Dienstleister durchgeführt. Ihr Anteil bestimmt sich aus dem Produkt der anteiligen Zeit, des Abrechnungsjahres, die Sie verwohnt haben und der entstandenen Heizkosten für das gesamte Abrechnungsjahr.");
        doc.moveDown();
        x=doc.x;
        y= doc.y;
        if(y>600) { doc.addPage(); y=doc.y;}
        doc.font('Helvetica-Bold').text("Ihre Heizkosten:", 72, y).font('Helvetica');
            y=y+30;
            x=72;
            doc.text("Gesamtkosten", x, y);
            x+=200;
            doc.text("Abrechnungszeitraum", x,y);
            x+=100;
            doc.text("Verwohnt", x, y);
            x+=120;
            doc.text("Ihr Anteil", x, y);
            //Table line
            y=y+15;
            doc.moveTo(72, y).lineTo(550, y).stroke();
            y=y+5;
            x=72;
            doc.text(add_zeros(Math.round(heating_costs*100)/100).replace('.',','), x, y);
            x+=200;
            doc.text("365", x,y);
            x+=100;
            doc.text(time_period, x, y);
            x+=120;
            var sum4=Math.round(heating_costs*100*(time_period/365))/100;
            doc.text(add_zeros(sum4).replace('.',','), x, y);
            //Table line
            y=y+30;
            if(y>500) { doc.addPage(); y=doc.y;}
            doc.y=y;
            doc.x=72;
            x=72;
            doc.font('Helvetica-Bold').text("Bezeichnung", x, y);
            x+=130;
            doc.text("Kosten", x, y).font('Helvetica');
            y=y+15;
            x=72;
            doc.moveTo(72, y).lineTo(300, y).stroke();
            y=y+15;
            doc.text("Betriebskosten1", x, y);
            x+=130;
            doc.text(add_zeros(sum1).replace('.',','), x, y, {width:80, align:'right'});
            y=y+15;
            x=72;
            doc.text("Betriebskosten2", x, y);
            x+=130;
            doc.text(add_zeros(sum2).replace('.',','), x, y, {width:80, align:'right'});
            y=y+15;
            x=72;
            doc.text("Betriebskosten3", x, y);
            x+=130;
            doc.text(add_zeros(sum3).replace('.',','), x, y, {width:80, align:'right'});
            y=y+15;
            x=72;
            doc.text("Betriebskosten4", x, y);
            x+=130;
            doc.text(add_zeros(sum4).replace('.',','), x, y, {width:80, align:'right'});
            y=y+15;
            doc.moveTo(72, y).lineTo(300, y).stroke();
            y=y+5;
            x=72;
            var all_costs=Math.round(100*(sum1+sum2+sum3+sum4))/100;
            console.log(add_zeros(all_costs).replace('.',','));
            doc.font('Helvetica-Bold').text("Ihre Betriebskosten", x, y);
            x+=130;
            doc.text(add_zeros(all_costs).replace('.',','), x, y, {width:80, align:'right'});
            y=y+15;
            x=72;
            doc.text("Ihre Vorauszahlungen", x, y);
            x+=130;
            var advance_payment=tenant.property_charges*12;
            doc.text(add_zeros(advance_payment).replace('.',','), x, y, {width:80, align:'right'});
            y=y+15;
            doc.moveTo(72, y).lineTo(300, y).stroke();
            y=y+5;
            x=72;
            if(all_costs>advance_payment){
              doc.text("Ihre Nachzahlung", x, y);
              x+=130;
              var result=Math.round((all_costs-advance_payment)*100)/100;
              doc.text(add_zeros(result).replace('.',','), x, y, {width:80, align:'right'});
            }else{
              doc.text("Ihr Guthaben", x, y);
              x+=130;
              var result=Math.round((advance_payment-all_costs)*100)/100;
              doc.text(add_zeros(advance_payment-all_costs).replace('.',','), x, y, {width:80, align:'right'});  
            }
            
        console.log(tenant);
           doc.end();
           console.log(apartment);
           

           writeStream.on('finish', ()=> {res.sendFile(dir+"/"+fileName);} );
          });
        });
      });
    });
}
