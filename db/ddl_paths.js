var fs = require("fs");
const path = require("path");

var DDLPaths = function(){
    this.CREATE_TABLE_EVENT_LOGS = path.resolve(__dirname, "table_definition/event_logs_table.sql");
    this.CREATE_TABLE_BUILDINGS = path.resolve(__dirname, "table_definition/buildings_table.sql");
    this.CREATE_TABLE_APARTMENTS = path.resolve(__dirname, "table_definition/apartments_table.sql");
    this.CREATE_TABLE_CUSTOMERS = path.resolve(__dirname, "table_definition/customers_table.sql");
    this.CREATE_TABLE_OWNERS = path.resolve(__dirname, "table_definition/owners_table.sql");
    this.CREATE_TABLE_TENANTS = path.resolve(__dirname, "table_definition/tenants_table.sql");
    this.CREATE_TABLE_OWNER_COMMUNITIES = path.resolve(__dirname, "table_definition/owner_communities_table.sql");
    this.CREATE_TABLE_OWNED_BY = path.resolve(__dirname, "table_definition/owned_by_table.sql");
    this.CREATE_TABLE_RENTED = path.resolve(__dirname, "table_definition/rented_table.sql");
    this.CREATE_TABLE_APARTMENT_COSTS = path.resolve(__dirname, "table_definition/apartment_costs_table.sql");
    
    this.BUILDINGS_CHECK_INTEGRITY =    path.resolve(__dirname, "procedures/check/buildings_check_integrity.sql");
    this.APARTMENTS_CHECK_INTEGRITY =   path.resolve(__dirname, "procedures/check/apartments_check_integrity.sql");
    this.APARTMENT_COSTS_CHECK_INTEGRITY =   path.resolve(__dirname, "procedures/check/apartment_costs_check_integrity.sql");
    this.CUSTOMERS_CHECK_INTEGRITY =    path.resolve(__dirname, "procedures/check/customers_check_integrity.sql");
    this.RENTED_CHECK_INTEGRITY =    path.resolve(__dirname, "procedures/check/rented_check_integrity.sql");
    
    this.APARTMENT_COSTS_BEFORE_INSERT = path.resolve(__dirname, "triggers/apartment_costs_before_insert.sql");
    this.APARTMENT_COSTS_BEFORE_UPDATE = path.resolve(__dirname, "triggers/apartment_costs_before_update.sql");
    this.APARTMENTS_BEFORE_INSERT = path.resolve(__dirname, "triggers/apartments_before_insert.sql");
    this.APARTMENTS_BEFORE_UPDATE = path.resolve(__dirname, "triggers/apartments_before_update.sql");
    this.BUILDINGS_BEFORE_INSERT =  path.resolve(__dirname, "triggers/buildings_before_insert.sql");
    this.BUILDINGS_BEFORE_UPDATE =  path.resolve(__dirname, "triggers/buildings_before_update.sql");
    this.CUSTOMERS_BEFORE_INSERT =  path.resolve(__dirname, "triggers/customers_before_insert.sql");
    this.CUSTOMERS_BEFORE_UPDATE =  path.resolve(__dirname, "triggers/customers_before_update.sql");
    this.RENTED_BEFORE_INSERT =  path.resolve(__dirname, "triggers/rented_before_insert.sql");
    this.RENTED_BEFORE_UPDATE =  path.resolve(__dirname, "triggers/rented_before_update.sql");
    
    this.TENANTS_AFTER_DELETE =  path.resolve(__dirname, "triggers/tenants_after_delete.sql");
    this.TENANTS_AFTER_INSERT =  path.resolve(__dirname, "triggers/tenants_after_insert.sql");
    this.OWNERS_AFTER_DELETE =  path.resolve(__dirname, "triggers/owners_after_delete.sql");
    this.OWNERS_AFTER_INSERT =  path.resolve(__dirname, "triggers/owners_after_insert.sql");
    
    this.ADD_FK_APARMENTS_BUILDINGS = path.resolve(__dirname, "constraints/add_fk_apartments_buildings.sql");
    this.ADD_FK_TENANTS_CUSTOMERS = path.resolve(__dirname, "constraints/add_fk_tenants_customers.sql");
    this.ADD_FK_OWNERS_CUSTOMERS = path.resolve(__dirname, "constraints/add_fk_owners_customers.sql");
    this.ADD_FK_BUILDINGS_OWNER_COMMUNITIES = path.resolve(__dirname, "constraints/add_fk_buildings_owner_communities.sql");
    this.ADD_FK_RENTED_APARTMENTS = path.resolve(__dirname, "constraints/add_fk_rented_apartments.sql");
    this.ADD_FK_RENTED_TENANTS = path.resolve(__dirname, "constraints/add_fk_rented_tenants.sql");
    this.ADD_FK_OWNED_BY_APARTMENTS = path.resolve(__dirname, "constraints/add_fk_owned_by_apartments.sql");
    this.ADD_FK_OWNED_BY_OWNERS = path.resolve(__dirname, "constraints/add_fk_owned_by_owners.sql");
    this.ADD_FK_APARMENT_COSTS_APARMENTS = path.resolve(__dirname, "constraints/add_fk_apartment_costs_apartments.sql");
    
    this.CREATE_VIEW_BUILDINGS =path.resolve(__dirname, "views/buildings_view.sql");
}

module.exports = DDLPaths;

