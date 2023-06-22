CREATE OR REPLACE FUNCTION update_modified_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW."Modified" = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;