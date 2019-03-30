use testdb;
DELIMITER $$
CREATE PROCEDURE `apartments_check_integrity`(
    IN apartment_indication INT,
    IN building_id INT,
    IN apartment_size DOUBLE,
    IN floor INT
    )
BEGIN
    IF (apartment_indication < 0) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on apartments.apartment_indication failed';
    END IF;
    IF (apartment_size < 0) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on apartments.apartment_size failed';
    END IF;
    IF ((SELECT total_area FROM buildings WHERE id=building_id) < apartment_size) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on apartments.apartment_size failed. It is greater then buildings.total_area';
    END IF;
    
    IF (floor < 0) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on apartments.floor failed';
    END IF;
END$$
 
DELIMITER ;

