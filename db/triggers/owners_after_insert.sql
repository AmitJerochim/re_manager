use testdb;
DELIMITER $$
CREATE TRIGGER `owners_after_insert` AFTER INSERT ON `owners`
FOR EACH ROW
BEGIN
    UPDATE customers SET is_owner=1 WHERE id=new.id;
    INSERT into event_logs(event_type, trigger_name, procedure_name, affected_table, affected_row, logging_time)values('INSERT','owners_after_insert',null,'customers',new.id, NOW());

END$$   
DELIMITER ; 
