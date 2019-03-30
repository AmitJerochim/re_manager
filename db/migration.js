    
var Migration = function(){
    this.CREATE_TABLE_BUILDINGS = 'CREATE TABLE IF NOT EXISTS re_manager.buildings( id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, street VARCHAR(255), street_nr VARCHAR(255), post_code INT, city VARCHAR(255), total_living_area DOUBLE, living_area_except_ground_floor DOUBLE, living_area_except_business_area DOUBLE, number_flats INT NOT NULL, year_of_completion INT );';
    this.CREATE_TABLE_APARMENTS = 'CREATE TABLE IF NOT EXISTS re_manager.apartments( id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, apartment_indication INT, building_id INT NOT NULL , tenant_id INT, apartment_size DOUBLE, floor INT, taxes Double);';
    this.CREATE_TABLE_TENANTS = "CREATE TABLE IF NOT EXISTS re_manager.tenants( id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255), apartment_id INT NOT NULL, net_cold_rent DOUBLE NOT NULL, property_charges DOUBLE NOT NULL, Current_tenant INT NOT NULL, beginning_rental_period DATE NOT NULL, end_rental_period DATE NOT NULL);";
    this.CREATE_TABLE_HOUSE_COST_TYPES='CREATE TABLE IF NOT EXISTS re_manager.house_cost_types( id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, designation VARCHAR(255) NOT NULL);';
    this.CREATE_TABLE_HOUSE_COSTS = 'CREATE TABLE IF NOT EXISTS re_manager.house_costs( id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, type INT NOT NULL, building_id INT NOT NULL, year INT NOT NULL, allocatable INT NOT NULL, distributor_key VARCHAR(255) NOT NULL, costs DOUBLE);';
    this.CREATE_TABLE_APARTMENT_HEATING_COSTS ='CREATE TABLE IF NOT EXISTS re_manager.apartment_heating_costs( id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, apartment_id INT NOT NULL, year INT NOT NULL, costs DOUBLE);';
    this.CREATE_TABLE_APARTMENT_ELECTRICITY_COSTS ='CREATE TABLE IF NOT EXISTS re_manager.apartment_electricity_costs( id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, apartment_id INT NOT NULL, year INT NOT NULL, costs DOUBLE);';
    this.CREATE_TABLE_APARTMENT_COMMUNICATION_COSTS ='CREATE TABLE IF NOT EXISTS re_manager.apartment_communication_costs( id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, apartment_id INT NOT NULL, year INT NOT NULL, costs DOUBLE);';
    
    this.ADD_FK_APARMENTS_BUILDINGS = 'ALTER TABLE re_manager.apartments ADD FOREIGN KEY (building_id) REFERENCES re_manager.buildings(id) ON DELETE CASCADE ON UPDATE CASCADE';
    this.ADD_FK_APARMENTS_TENANTS = 'ALTER TABLE re_manager.apartments ADD FOREIGN KEY (tenant_id) REFERENCES re_manager.tenants(id) ON DELETE CASCADE ON UPDATE CASCADE';
    this.ADD_FK_TENANTS_APARMENTS = 'ALTER TABLE re_manager.tenants ADD FOREIGN KEY (apartment_id) REFERENCES re_manager.apartments(id) ON DELETE CASCADE ON UPDATE CASCADE';
    this.ADD_FK_HOUSE_COSTS_BUILDINGS = 'ALTER TABLE re_manager.house_costs ADD FOREIGN KEY (building_id) REFERENCES re_manager.buildings(id) ON DELETE CASCADE ON UPDATE CASCADE';
    this.ADD_FK_HOUSE_COSTS_HOUSE_COST_TYPES= 'ALTER TABLE re_manager.house_costs ADD FOREIGN KEY (type) REFERENCES re_manager.house_cost_types(id) ON DELETE CASCADE ON UPDATE CASCADE';
    this.ADD_FK_APARTMENT_HEATING_COSTS_APARTMENTS ='ALTER TABLE re_manager.apartment_heating_costs ADD FOREIGN KEY(apartment_id) REFERENCES re_manager.apartments(id) ON DELETE CASCADE ON UPDATE CASCADE';
    this.ADD_FK_APARTMENT_ELECTRICITY_COSTS_APARTMENTS ='ALTER TABLE re_manager.apartment_electricity_costs ADD FOREIGN KEY(apartment_id) REFERENCES re_manager.apartments(id) ON DELETE CASCADE ON UPDATE CASCADE';
    this.ADD_FK_APARTMENT_COMMUNICATION_COSTS_APARTMENTS ='ALTER TABLE re_manager.apartment_communication_costs ADD FOREIGN KEY(apartment_id) REFERENCES re_manager.apartments(id) ON DELETE CASCADE ON UPDATE CASCADE';

}

module.exports = Migration;

