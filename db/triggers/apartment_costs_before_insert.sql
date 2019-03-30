use testdb;
DELIMITER $$
CREATE TRIGGER `apartment_costs_before_insert` BEFORE INSERT ON `apartment_costs`
FOR EACH ROW
BEGIN
    call apartment_costs_check_integrity(new.apartment_id ,new.costs,new.period ,new.beginning_date ,new.ending_date);
END$$   
DELIMITER ; 
    