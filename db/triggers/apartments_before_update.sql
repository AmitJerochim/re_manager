use testdb;
DELIMITER $$
CREATE TRIGGER `apartments_before_update` BEFORE UPDATE ON `apartments`
FOR EACH ROW
BEGIN
    call apartments_check_integrity(new.apartment_indication ,new.building_id, new.apartment_size ,new.floor);
END$$   
DELIMITER ; 