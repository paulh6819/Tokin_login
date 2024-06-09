CREATE TABLE users(
    id serial PRIMARY KEY,
    username varchar(255) NOT NULL
);

CREATE TABLE tokens(
    id serial PRIMARY KEY,
    user_id integer REFERENCES users(id),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE token_counts(
    id serial PRIMARY KEY,
    user_id integer REFERENCES users(id),
    token_count integer,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_token_count_down_period()
    RETURNS TRIGGER
    AS $$
BEGIN
    IF NEW.token_count = 9 AND OLD.token_count = 10 THEN
        NEW.token_count_down_period = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

