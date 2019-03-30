use testdb;
CREATE TABLE IF NOT EXISTS owned_by(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    apartment_id INT NOT NULL,
    owner_id INT NOT NULL,
    current_owner INT NOT NULL,
    purchasing_date DATE NOT NULL,
    selling_date DATE NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NOT NULL
);
