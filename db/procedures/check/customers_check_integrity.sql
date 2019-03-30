use testdb;
DELIMITER $$
CREATE PROCEDURE `customers_check_integrity`(
    IN first_name VARCHAR(255), 
    IN last_name VARCHAR(255),
    IN care_of VARCHAR(255),
    IN street VARCHAR(255),
    IN street_nr VARCHAR(255),
    IN post_code VARCHAR(255),
    IN city VARCHAR(255),
    IN country INT,
    IN is_owner INT,
    IN is_tenant INT
    )
BEGIN

    IF (((first_name IS NULL)=1) OR (first_name REGEXP '^[A-ZÖÜÄ][a-zßäöü]+(([-[:blank:]][A-ZÜÖÄ][a-züöäß]+)*)?$')<>1 ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on customers.first_name failed';
    END IF; 
    IF (((last_name IS NULL)=1) OR (last_name REGEXP '^[A-ZÖÜÄ][a-zßäöü]+(([-[:blank:]][A-ZÜÖÄ][a-züöäß]+)*)?$')<>1 ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on customers.last_name failed';
    END IF; 
    IF ( (care_of REGEXP '^[A-ZÖÜÄ][a-zßäöü]+(([-[:blank:]][A-ZÜÖÄ][a-züöäß]+)*)?$')<>1 ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on customers.care_of failed';
    END IF; 
    IF (((street IS NULL)=1) OR (street REGEXP '^[A-ZÖÜÄ][a-zßäöü]+(([-[:blank:]][A-ZÜÖÄ][a-züöäß]+)*)?$')<>1 ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on customers.street failed';
    END IF;    
    IF (((street_nr IS NULL)=1) OR (street_nr REGEXP '^[1-9][0-9]{0,2}[a-zA-Z]?$')<>1 ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on customers.street_nr failed';
    END IF;    
    IF (((post_code IS NULL)=1) OR (post_code REGEXP '^[0-9]{5}$')<>1 ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on customers.post_code failed';
    END IF;
    IF (((city IS NULL)=1) OR (city REGEXP '^[A-ZÖÜÄ][a-zßäöü]+(([-[:blank:]][A-ZÜÖÄ][a-züöäß]+)*)?$')<>1 ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on customers.city failed';
    END IF;
    IF (((is_owner IS NULL)=1) OR (is_owner REGEXP '^[01]$')<>1 ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on customers.is_owner failed';
    END IF;
    IF (((is_tenant IS NULL)=1) OR (is_tenant REGEXP '^[01]$')<>1 ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on customers.is_tenant failed';
    END IF;  
END$$
 
DELIMITER ;

