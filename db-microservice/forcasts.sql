CREATE TABLE IF NOT EXISTS forecasts (
    id SERIAL PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    cloud_coverage DECIMAL NOT NULL,
    estimated_energy DECIMAL NOT NULL
);