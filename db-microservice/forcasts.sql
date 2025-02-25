DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- should be created automatically
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS forecasts (
    id SERIAL PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    cloud_coverage DECIMAL NOT NULL,
    estimated_energy DECIMAL NOT NULL
);