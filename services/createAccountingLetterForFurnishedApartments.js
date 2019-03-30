var PDFDocument = require('pdfkit');
var shell = require('shelljs');
var fs = require('fs');
var path = require('path');
var Functions= require("./helperFunctions.js");
module.exports = function(db, req, res){
    var functions = new Functions;
    var doc = new PDFDocument();
    var data ={};
    var year = req.query.year;
    var tenant_id = req.params.id;
    var add_zeros=functions.add_zeros;
    var get_apartment_id_by_tenant=functions.get_apartment_id_by_tenant;
    var get_building_id_by_apartment=functions.get_building_id_by_apartment;
    var get_building_by_id= functions.get_building_by_id;
    var get_apartment_by_id = functions.get_apartment_by_id;
    var get_tenant_by_id = functions.get_tenant_by_id;
    var get_house_costs =functions.get_house_costs;
    var get_heating_costs = functions.get_heating_costs;
    var get_communication_costs = functions.get_communication_costs;
    var get_electricity_costs = functions.get_electricity_costs;
    var getAccountingPeriod = functions.getAccountingPeriod;
    var setAsCost = functions.setAsCost;
    var sumHouseCosts = functions.sumHouseCosts;
    var sumPartialCosts = functions.sumPartialCosts;
    var calc_dest_key_by_total_living_area=functions.calc_dest_key_by_total_living_area;
    var calc_dest_key_by_living_area_exept_groundfloor=functions.calc_dest_key_by_living_area_exept_groundfloor;
    var calc_dest_key_by_number_flats=functions.calc_dest_key_by_number_flats;
    var calc_dest_key_for_individual_costs=functions.calc_dest_key_for_individual_costs;
    
    get_apartment_id_by_tenant(db, tenant_id).then(function(apartment_id){
      get_building_id_by_apartment(db, apartment_id).then(function(building_id){
        Promise.all(
          [
            get_building_by_id(db, building_id, data),
            get_apartment_by_id(db, apartment_id, data),
            get_tenant_by_id(db, tenant_id,data),
            get_heating_costs(db, data, apartment_id, year),
            get_electricity_costs(db, data, apartment_id, year),
            get_communication_costs(db, data, apartment_id, year),
            get_house_costs(db, data, building_id, year, "foreign_calculation"),
            get_house_costs(db, data, building_id, year, "number_flats"),
            get_house_costs(db, data, building_id, year, "total_living_area"),
            get_house_costs(db, data, building_id, year, "living_area_except_ground_floor"),
          ])
        .then(function(){
           var tenant = data.tenant;
           var building = data.building;
           var apartment = data.apartment;
           var heating_costs = data.heating_costs;
           var electricity_costs = data.electricity_costs;
           var communication_costs = data.communication_costs;
           //var house_costs_distributed_by_foreign_calculation =data.house_costs_distributed_by_foreign_calculation;
           var house_costs_distributed_by_number_flats =data.house_costs_distributed_by_number_flats;
           var house_costs_distributed_by_total_living_area =data.house_costs_distributed_by_total_living_area;
           var house_costs_distributed_by_living_area_except_ground_floor =data.house_costs_distributed_by_living_area_except_ground_floor;
           var now= new Date();
           var month= 1+now.getMonth();
           var time_period=getAccountingPeriod(tenant,year);
           var dest_key_by_total_living_area =calc_dest_key_by_total_living_area( time_period, apartment.size,building.total_living_area);
           var dest_key_by_living_area_exept_groundfloor=calc_dest_key_by_living_area_exept_groundfloor(time_period, apartment.size, building.living_area_except_ground_floor,apartment.floor);
           var dest_key_by_number_flats =calc_dest_key_by_number_flats(time_period, building.number_flats);
           var dest_key_by_individual_costs = calc_dest_key_for_individual_costs(time_period);

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
           doc.fontSize(11);
           doc.text("Berlin, den "+ now.getUTCDate()  +"."+month + "."+now.getFullYear() , x+330, y);
           doc.text("Moran Jerochim", x, y);
           doc.text("Alemannenallee 11");
           doc.text("14052 Berlin");
           doc.y = doc.y+100;
           doc.text(tenant.name);
           doc.text(building.street+ " " + building.street_nr);
           doc.text(building.post_code + " " + building.city);
           doc.x=72
           doc.y=doc.y +50;
           doc.fontSize(10);
           y=doc.y;
           x=72;
           doc.text("Gebäude:",x,y);
           doc.text(building.street+ " " + building.street_nr,x+50,y);
           doc.text("Whg-Nr:",x+200,y);
           doc.text("WE "+apartment.indication,x+245,y);
           doc.text("Etage:",x+350,y);
           var floor;
           if(apartment.floor==0){ floor="EG"}else{floor=apartment.floor +". OG"}
           doc.text(floor,x+390,y);
           x=72;
           doc.x=72;
           doc.y+=5;
           doc.fontSize(14);
           doc.font('Helvetica-Bold');
           doc.text("Betriebskostenabrechnung für den Zeitraum 01.01."+year+ " bis 31.12."+year);
           doc.moveDown();
           doc.fontSize(11);
           doc.text("Allgemeine Erläuterung zur Berechnung des Verteilerschlüssels:");
           doc.font('Helvetica');
           doc.text("Ihr Verteilerschlüssel ergibt sich aus dem Produkt ihres Anteils der Berechnungsgrundlage sowie den Zeitraum der Abrechnungsperiode, die Sie verwohnt haben dividiert durch das Produkt aus gesamten Berechnungsgrundlage und dem gesamten Zeitraum der Abrechnungsperiode");
           doc.moveDown();

    
    var writeDestKeyAndCostTable=(doc, x,y, dest_key, house_costs_object, calc_base, calc_partial, calc_unit)=>{
            /*
            dest key ist der verteilerschlüssel
            calc unit ist z.B. quadratmeter oder wohneinheitens
            calc partial ist z.B. wohnungsgröße oder 1 bei wohnheinheitens
            calc base ist z.B. gesamtwohnfläche oder  anzahl wohnungen
            */
            

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
                var partial_costs = setAsCost(house_costs_object[i].costs*dest_key);
                var house_costs=setAsCost(Number(house_costs_object[i].costs));
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
            doc.font("Helvetica-Bold");
            doc.text("Gesamtkosten", 72, y);
            doc.text(setAsCost(sumHouseCosts(house_costs_object)), x-200,y, {width:80, align:'right'});
            if (doc.y<y) y=doc.y;
            //sum_partial_costs=Math.round(sum_partial_costs*100)/100;
            doc.text(setAsCost(sumPartialCosts(dest_key, house_costs_object )), x,y, {width:80, align:'right'});
            doc.font("Helvetica");
            y=y+50;
            doc.x=72;
            doc.y=y;
            //return sumPartialCosts(dest_key, house_costs_object );
        }
        var sums = {};
        
        sums.total_living_area=sumPartialCosts(dest_key_by_total_living_area, house_costs_distributed_by_total_living_area);
        sums.number_flats=sumPartialCosts(dest_key_by_number_flats, house_costs_distributed_by_number_flats);
        sums.living_area_except_ground_floor=sumPartialCosts(dest_key_by_living_area_exept_groundfloor, house_costs_distributed_by_living_area_except_ground_floor);
        // sums.taxes=apartment.taxes*(time_period/365);
        // sums.heating_costs=heating_costs*(time_period/365);
        // sums.electricity_costs=electricity_costs*(time_period/365);
        // sums.communication_costs=communication_costs*(time_period/365);
        sums.individual= (apartment.taxes+heating_costs+electricity_costs+communication_costs)*(time_period/365);
        if(house_costs_distributed_by_total_living_area.length>0){
          if(y>600) { doc.addPage(); y=doc.y;}
          doc.font('Helvetica-Bold').text("Berechnung des Verteilerschlüssels anhand der Wohnfläche:").font('Helvetica');
          doc.moveDown();
          x=doc.x;
          y= doc.y;
          writeDestKeyAndCostTable(doc, x, y, dest_key_by_total_living_area, house_costs_distributed_by_total_living_area, building.total_living_area, apartment.size, "m²" );
        }
        
        if(house_costs_distributed_by_number_flats.length>0){
          if(y>600) { doc.addPage(); y=doc.y;}
          doc.font('Helvetica-Bold').text("Berechnung des Verteilerschlüssels anhand der Anzahl an Wohnungen:").font('Helvetica');
          doc.moveDown();
          x=doc.x;
          y= doc.y;
          writeDestKeyAndCostTable(doc, x, y, dest_key_by_number_flats, house_costs_distributed_by_number_flats, building.number_flats, "1", "Wohnheinheiten" );
        }
        
        if(house_costs_distributed_by_living_area_except_ground_floor.length>0){
          if(y>600) { doc.addPage(); y=doc.y;}
          doc.font('Helvetica-Bold').text("Berechnung des Verteilerschlüssels anhand der Wohnfläche (Außer Erdgeschoß):").font('Helvetica');
          doc.moveDown();
          x=doc.x;
          y= doc.y;
          writeDestKeyAndCostTable(doc, x, y, dest_key_by_living_area_exept_groundfloor, house_costs_distributed_by_living_area_except_ground_floor, building.living_area_except_ground_floor, apartment.size, "m²" );
        }
      
        doc.moveDown();
        doc.x=72;
        x=72;
        y= doc.y;
        doc.font('Helvetica-Bold').text("Berechnung der Individualkosten:").font('Helvetica');
        doc.text("Individualkosten sind solche Kosten, die für jede Wohnung individuell gemessen werden können. Diese sind Verbrauchsabhängig. Hierbei errechnet sich Ihr Anteil als die Gesamtkosten für die Abrechnungsperiode multipliziert mit dem zeitlichen Anteil, den Sie in Anspruch genommen haben.");
        doc.moveDown();
        if(y>600) { doc.addPage(); y=doc.y;}
        doc.x=72;
        y=doc.y
        doc.text("Gesamte Abrechnungszeit", x, y);
        doc.text("Ihr Anteil", x+200, y);
        doc.text("Ihr Verteilerschlüssel", x+350, y);
        y=y+15;
        doc.moveTo(72, y).lineTo(550, y).stroke();
        y=y+5;
        doc.text("365", x, y);
        doc.text(time_period, x+200, y);
        doc.text(dest_key_by_individual_costs, x+350, y,{width:80, align:'right'});
        doc.moveDown();
        doc.x=72;
        x=72;
        y= doc.y;
        if(y>600) { doc.addPage(); y=doc.y;}
        doc.font('Helvetica-Bold').text("Ihre Individualkosten:", 72, y).font('Helvetica');
            y=y+30;
            x=72;
            doc.text("Bezeichnung", x, y)
            x+=200;
            doc.text("Gesamtkosten", x, y);
            x+=100;
            doc.text("Ihr Verteilerschlüssel", x,y);
            x+=120;
            doc.text("Ihr Anteil", x, y);
            
            
            //Table line
            y=y+15;
            doc.moveTo(72, y).lineTo(550, y).stroke();
            y=y+5;
            
            //heating costs
            x=72;
            doc.text("Heizkosten", x, y);
            x+=200;
            doc.text(setAsCost(heating_costs), x,y, {width:80, align:'right'});
            x+=100;
            doc.text(dest_key_by_individual_costs, x, y, {width:80, align:'right'});
            x+=100;
            doc.text(setAsCost(heating_costs*(time_period/365)), x, y,{width:80, align:'right'});
            
            y=y+15;
            x=72;
            doc.text("Grundsteuer", x, y);
            x+=200;
            doc.text(setAsCost(apartment.taxes), x,y, {width:80, align:'right'});
            x+=100;
            doc.text(dest_key_by_individual_costs, x, y, {width:80, align:'right'});
            x+=100;
            doc.text(setAsCost(apartment.taxes*(time_period/365)), x, y,{width:80, align:'right'});
                     
            y=y+15;
            x=72;
            doc.text("Wohnungsstrom", x, y);
            x+=200;
            doc.text(setAsCost(electricity_costs), x,y, {width:80, align:'right'});
            x+=100;
            doc.text(dest_key_by_individual_costs, x, y, {width:80, align:'right'});
            x+=100;
            doc.text(setAsCost(electricity_costs*(time_period/365)), x, y,{width:80, align:'right'});
         
            y=y+15;
            x=72;
            doc.text("Telefon und Internet", x, y);
            x+=200;
            doc.text(setAsCost(communication_costs), x,y, {width:80, align:'right'});
            x+=100;
            doc.text(dest_key_by_individual_costs, x, y, {width:80, align:'right'});
            x+=100;
            doc.text(setAsCost(communication_costs*(time_period/365)), x, y,{width:80, align:'right'});
            y=y+15;
            
            
            doc.moveTo(72, y).lineTo(550, y).stroke();
            y=y+5;
            x=72;
            doc.font("Helvetica-Bold");
            doc.text("Gesamtkosten", x, y);
            x=472;
            doc.text(setAsCost(sums.individual), x, y,{width:80, align:'right'});
            doc.font("Helvetica-Bold");
            
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
            
            var counter = 0;
            var all_costs = 0;

            for(var key in sums){
              if(sums[key]!=0){
                counter+=1;
                all_costs+=sums[key];
                y=y+15;
                doc.text("Betriebskosten" + counter, x, y);
                x+=130;
                doc.text(setAsCost(sums[key]), x, y, {width:80, align:'right'});
                x=72;
              }
            }
            
            y=y+15;
            doc.moveTo(72, y).lineTo(300, y).stroke();
            y=y+5;
            x=72;
            
            doc.font('Helvetica-Bold').text("Ihre Betriebskosten", x, y);
            x+=130;
            doc.text(setAsCost(all_costs), x, y, {width:80, align:'right'});
            y=y+15;
            x=72;
            doc.text("Ihre Vorauszahlungen", x, y);
            x+=130;
            var advance_payment=tenant.property_charges*12;
            doc.text(setAsCost(advance_payment), x, y, {width:80, align:'right'});
            y=y+15;
            doc.moveTo(72, y).lineTo(300, y).stroke();
            y=y+5;
            x=72;
            
            var hasAdditionalPayment=true;
            var additionalPayment=setAsCost(all_costs-advance_payment);
            var paymentReturn= setAsCost(advance_payment-all_costs);
            
            if(all_costs>advance_payment){
              doc.text("Ihre Nachzahlung", x, y);
              x+=130;
              doc.text(additionalPayment, x, y, {width:80, align:'right'});
            }else{
              hasAdditionalPayment=false;
              doc.text("Ihr Guthaben", x, y);
              x+=130;
              doc.text(paymentReturn, x, y, {width:80, align:'right'});  
            }
            
           //Einschreiben 
           doc.font("Helvetica");
           doc.addPage();
           doc.fontSize(11);
           x=doc.x;
           y= doc.y;
           doc.text("Berlin, den "+ now.getUTCDate()  +"."+month + "."+now.getFullYear() , x+330, y);
           doc.text("Moran Jerochim", x, y);
           doc.text("Alemannenallee 11");
           doc.text("14052 Berlin");
           doc.y = doc.y+100;
           
           doc.text(tenant.name);
           doc.text(building.street+ " " + building.street_nr);
           doc.text(building.post_code + " " + building.city);
           doc.x=72
           doc.y=doc.y +50;
           doc.fontSize(10);
           y=doc.y;
           x=72;
           doc.text("Gebäude:",x,y);
           doc.text(building.street+ " " + building.street_nr,x+50,y);
           doc.text("Whg-Nr:",x+200,y);
           doc.text("WE "+apartment.indication,x+245,y);
           doc.text("Etage:",x+350,y);
           var floor;
           if(apartment.floor==0){ floor="EG"}else{floor=apartment.floor +". OG"}
           doc.text(floor,x+390,y);
           x=72;
           doc.x=72;
           doc.y+=5;
           doc.fontSize(14);
           doc.font('Helvetica-Bold');
           doc.text("Betriebskostenabrechnung für den Zeitraum 01.01."+year+ " bis 31.12."+year);
           doc.moveDown();
           doc.moveDown();
           doc.fontSize(11);
           doc.font("Helvetica");
           doc.text("Sehr geehrte Mieterin, sehr geehrter Mieter,");
           doc.moveDown();
           doc.text("nachstehend erhalten Sie o.g. Betriebskostenabrechnung.")
           doc.moveDown();
           doc.text("Die im Abrechnungszeitraum angefallenen Kosten Werden den in Ihrer Miete enthaltenen Vorauszahlungen gegenübergestellt. Die Abrechnungsunterlagen können Sie nach vorheriger Terminabsprache mit dem Hausverwalter einsehen.")
           doc.moveDown();
           doc.text("Die Umlage der Betriebskostenerfolgt gemäß den Vereinbarungen in Ihrem Mietvertrag.Bei den Wohnungen wurden zusätzlich die jeweils geltenden gesetzlichen Bestimmungen berücksichtigt. Das sind insbesondere bei freifinanziertem sowie mit vereinbarter Förderung erstelltem Wohnraum die Betriebskostenverordnung vom 25. November 2003 sowie die gesetzlichen Bestimmungen gemäß §§ 556, 556a BGB");
           doc.moveDown();
           if(hasAdditionalPayment==true){
              doc.font("Helvetica-Bold").text("Ihre Abrechnungsergebnis ergibt eine Nachzahlung in Höhe von " + additionalPayment + " €.");
              doc.moveDown();
              doc.font("Helvetica").text("Bitte überweisen Sie das Geld auf das im folgenden genannte Bankkonto Innerhalb von zwei Wochen:");
              doc.moveDown();
              x=doc.x;
              y=doc.y;
              doc.font("Helvetica-Bold").text("Inhaber:",x,y);
              doc.font("Helvetica").text("Moran Jerochim",x+150,y);
              y+=15;
              doc.font("Helvetica-Bold").text("IBAN:",x,y);
              doc.font("Helvetica").text("DE12345678910234500", x+150, y);
              y+=15;
              doc.font("Helvetica-Bold").text("BIC:",x, y);
              doc.font("Helvetica").text("ABCDEF",x+150, y);
              y+=15;
              doc.font("Helvetica-Bold").text("Betrag:",x, y);
              doc.font("Helvetica").text(additionalPayment+ " €" ,x+150, y);
              y+=15;
              doc.font("Helvetica-Bold").text("Verwendungszweck:",x, y); 
              doc.font("Helvetica").text("Nachzahlung Betriebskosten "+year+" WE"+apartment.indication, x+150, y);
           }else{
              
              doc.font("Helvetica-Bold").text("Ihre Abrechnungsergebnis ergibt einen Guthaben in Höhe von " + paymentReturn+" €.");
              doc.font("Helvetica").text("Das Geld wird nach einer Bestätigung der Abrechnung Ihrerseits auf Ihr Konto überwiesen.");  

           }
           y=doc.y;
           y+=15;
           doc.y=y;
           doc.x=72;
           doc.moveDown();
           doc.text("Sie Können dieser Abrechnung innerhalb von vier Wochen ab Eingang des Schreibens widersprechen.");
           doc.moveDown();
           doc.text("Mit freundlichen Grüßen")
           doc.moveDown();
           doc.text("Moran Jerochim")
           doc.end();
           
           writeStream.on('finish', ()=> {res.sendFile(dir+"/"+fileName);} );
          });
        });
      });
    });
}