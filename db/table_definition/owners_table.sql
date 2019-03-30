use testdb;
CREATE TABLE IF NOT EXISTS owners(
    id INT NOT NULL PRIMARY KEY,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NOT NULL
);
