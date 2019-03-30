use testdb;
CREATE TABLE IF NOT EXISTS apartment_costs(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    apartment_id INT NOT NULL,
    costs DOUBLE NOT NULL,
    period VARCHAR(255) NOT NULL,
    beginning_date DATE NOT NULL,
    ending_date DATE NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NOT NULL
);
