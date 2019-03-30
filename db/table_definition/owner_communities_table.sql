use testdb;
CREATE TABLE IF NOT EXISTS owner_communities(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NOT NULL
);
