use testdb;
DELIMITER $$
CREATE TRIGGER `owners_after_delete` AFTER DELETE ON `owners`
FOR EACH ROW
BEGIN
    UPDATE customers SET is_owner=0 WHERE id=old.id;
        INSERT into event_logs(event_type, trigger_name, procedure_name, affected_table, affected_row, logging_time)values('DELETE','owners_after_delete',null,'customers',OLD.id, NOW());

END$$   
DELIMITER ; 
