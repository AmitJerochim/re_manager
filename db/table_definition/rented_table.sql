use testdb;
CREATE TABLE IF NOT EXISTS rented(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    apartment_id INT NOT NULL,
    tenant_id INT NOT NULL,
    current_tenant INT NOT NULL,
    beginning_rental_period DATE NOT NULL,
    end_rental_period DATE NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NOT NULL
);
