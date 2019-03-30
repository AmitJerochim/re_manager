use testdb;
DELIMITER $$
CREATE PROCEDURE `buildings_check_integrity`(
    IN street VARCHAR(255),
    IN street_nr VARCHAR(255),
    IN post_code VARCHAR(255),
    IN city VARCHAR(255),
    IN total_area DOUBLE,
    IN ground_floor_area DOUBLE,
    IN business_area DOUBLE,
    IN number_flats INT,
    IN year_of_completion INT
    )
BEGIN
    IF (((street IS NULL)=1) OR (street REGEXP '^[A-ZÖÜÄ][a-zßäöü]+(([-[:blank:]][A-ZÜÖÄ][a-züöäß]+)*)?$')<>1 ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on buildings.street failed';
    END IF;    
    IF (((street_nr IS NULL)=1) OR (street_nr REGEXP '^[1-9][0-9]{0,2}[a-zA-Z]?$')<>1 ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on buildings.street_nr failed';
    END IF;    
    IF (((post_code IS NULL)=1) OR (post_code REGEXP '^[0-9]{5}$')<>1 ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on buildings.post_code failed';
    END IF;
    IF (((city IS NULL)=1) OR (city REGEXP '^[A-ZÖÜÄ][a-zßäöü]+(([-[:blank:]][A-ZÜÖÄ][a-züöäß]+)*)?$')<>1 ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on buildings.city failed';
    END IF;    
    IF (total_area < 0) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on buildings.total_area failed';
    END IF;
    IF (ground_floor_area < 0) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on buildings.ground_floor_area failed';
    END IF;
    IF (business_area < 0) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on buildings.business_area failed';
    END IF;
    IF (total_area < business_area) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on buildings.business_area, buildings.total_area failed, business_area greater than total_area';
    END IF;
    IF (total_area < ground_floor_area) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on buildings.business_area, buildings.total_area failed, business_area greater than total_area';
    END IF;        
    IF (number_flats < 1 OR number_flats > 1000) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on buildings.number_flats failed';
    END IF;
    IF (year_of_completion < 1700 OR year_of_completion > 2030) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on buildings.year_of_completion failed';
    END IF;
END$$
 
DELIMITER ;

