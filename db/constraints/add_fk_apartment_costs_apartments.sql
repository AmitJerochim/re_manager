use testdb;
ALTER TABLE apartment_costs ADD FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE ON UPDATE CASCADE;