use testdb;
DELIMITER $$
CREATE PROCEDURE `rented_check_integrity`(
    IN apartment_id INT,
    IN tenant_id INT,
    IN current_tenant INT,
    IN beginning_rental_period DATE,
    IN end_rental_period DATE
    )
BEGIN
    IF (((current_tenant IS NULL)=1) OR (current_tenant REGEXP '^[01]$')<>1 ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on rented.current_tenant failed';
    END IF; 
END$$
 
DELIMITER ;

