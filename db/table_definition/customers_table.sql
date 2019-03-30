use testdb;
CREATE TABLE IF NOT EXISTS customers(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    care_of VARCHAR(255),
    street VARCHAR(255) NOT NULL,
    street_nr VARCHAR(255) NOT NULL,
    post_code VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    country INT NOT NULL,
    is_owner INT NOT NULL,
    is_tenant INT NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NOT NULL
);
