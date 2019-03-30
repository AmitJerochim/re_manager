use testdb;
CREATE TABLE IF NOT EXISTS event_logs(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    event_type VARCHAR(255),
    trigger_name VARCHAR(255),
    procedure_name VARCHAR(255),
    affected_table VARCHAR(255),
    affected_row INT,
    logging_time TIMESTAMP,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NOT NULL
);
