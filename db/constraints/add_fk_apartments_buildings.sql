use testdb;
ALTER TABLE apartments ADD FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE ON UPDATE CASCADE;