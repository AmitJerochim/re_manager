use testdb;
DELIMITER $$
CREATE TRIGGER `tenants_after_delete` AFTER DELETE ON `tenants`
FOR EACH ROW
BEGIN
    UPDATE customers SET is_tenant=0 WHERE id=OLD.id;
    INSERT into event_logs(event_type, trigger_name, procedure_name, affected_table, affected_row, logging_time)values('DELETE','tenants_after_delete',null,'customers',OLD.id, NOW());
END$$   
DELIMITER ; 
