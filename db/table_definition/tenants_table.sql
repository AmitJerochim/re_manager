use testdb;
CREATE TABLE IF NOT EXISTS tenants(
    id INT NOT NULL PRIMARY KEY,
    updated_at TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP NOT NULL
);
