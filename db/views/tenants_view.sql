use testdb;
CREATE VIEW v_buildings AS( SELECT
    id,
    apartment_id,
    costs,
    period,
    beginning_date,
    ending_date
    FROM buildings WHERE deleted_at='0000-00-00'
);
