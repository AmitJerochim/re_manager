use testdb;
DELIMITER $$
CREATE TRIGGER `buildings_before_update` BEFORE UPDATE ON `buildings`
FOR EACH ROW
BEGIN
    call buildings_check_integrity(new.street ,new.street_nr, new.post_code, new.city ,new.total_area ,new.ground_floor_area, new.business_area, new.number_flats, new.year_of_completion);
END$$   
DELIMITER ;