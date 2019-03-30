use testdb;
CREATE TABLE IF NOT EXISTS apartments(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    apartment_indication INT NOT NULL,
    building_id INT NOT NULL,
    apartment_size DOUBLE NOT NULL,
    floor INT NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NOT NULL
);
