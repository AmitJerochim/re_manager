use testdb;
ALTER TABLE owned_by ADD FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE ON UPDATE CASCADE;