use testdb;
ALTER TABLE buildings ADD FOREIGN KEY (owner_community_id) REFERENCES owner_communities(id) ON DELETE CASCADE ON UPDATE CASCADE;