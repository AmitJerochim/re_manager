use testdb;
DELIMITER $$
CREATE TRIGGER `rented_before_update` BEFORE UPDATE ON `rented`
FOR EACH ROW
BEGIN
    call rented_check_integrity(new.apartment_id, new.tenant_id, new.current_tenant, new.beginning_rental_period, new.end_rental_period);
END$$   
DELIMITER ; 
