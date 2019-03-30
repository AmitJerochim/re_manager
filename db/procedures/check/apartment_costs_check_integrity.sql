use testdb;
DELIMITER $$
CREATE PROCEDURE `apartment_costs_check_integrity`(
    IN apartment_id INT,
    IN costs DOUBLE,
    IN period VARCHAR(255),
    IN beginning_date DATE,
    IN ending_date DATE
    )
BEGIN
    IF (costs < 0) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on apartment_costs.costs failed';
    END IF;
    IF (((period IS NULL)=1) OR (period REGEXP '^(yearly|monthly|once|weekly|daily)$')<>1 ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'check constraint on buildings.period failed. Valid values are yearly|monthly|once|weekly|daily.';
    END IF;
END$$
 
DELIMITER ;