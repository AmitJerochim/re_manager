use testdb;
DELIMITER $$
CREATE TRIGGER `customers_before_update` BEFORE UPDATE ON `customers`
FOR EACH ROW
BEGIN
    call customers_check_integrity(new.first_name ,new.last_name, new.care_of, new.street, new.street_nr ,new.post_code ,new.city, new.country, new.is_owner, new.is_tenant);
END$$   
DELIMITER ; 