use testdb;
DELIMITER $$
CREATE PROCEDURE `customers_set_tenant_id`(
    IN tenant_id INT
    )
BEGIN
    UPDATE customers SET tenant_id=tenant_id WHERE id=tenant_id;
END$$
 
DELIMITER ;

