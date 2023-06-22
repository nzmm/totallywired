CREATE OR REPLACE TRIGGER auto_update_modtime
    BEFORE INSERT OR UPDATE ON "Artists" 
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE OR REPLACE TRIGGER auto_update_modtime
    BEFORE INSERT OR UPDATE ON "Releases"
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE OR REPLACE TRIGGER auto_update_modtime
    BEFORE INSERT OR UPDATE ON "Sources"
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE OR REPLACE TRIGGER auto_update_modtime
    BEFORE INSERT OR UPDATE ON "TrackReactions"
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE OR REPLACE TRIGGER auto_update_modtime
    BEFORE INSERT OR UPDATE ON "Tracks"
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE OR REPLACE TRIGGER auto_update_modtime
    BEFORE INSERT OR UPDATE ON "Users"
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
