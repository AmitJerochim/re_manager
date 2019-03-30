use testdb;
CREATE TABLE IF NOT EXISTS buildings(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    street VARCHAR(255) NOT NULL,
    street_nr VARCHAR(255) NOT NULL,
    post_code VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    total_area DOUBLE NOT NULL,
    ground_floor_area DOUBLE NOT NULL,
    business_area DOUBLE NOT NULL ,
    number_flats INT NOT NULL ,
    year_of_completion INT NOT NULL ,
    owner_community_id INT NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NOT NULL
);
