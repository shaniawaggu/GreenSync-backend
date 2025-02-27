DROP TABLE IF EXISTS users, forecasts;

CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- should be created automatically
    PRIMARY KEY (user_id)
);

CREATE TABLE forecasts (
    forecast_id INT GENERATED ALWAYS AS IDENTITY,
    dateAndTime VARCHAR(25),
    estimatedEnergy DECIMAL(50,5),
    windEnergy DECIMAL(50,5),
    solarEnergy DECIMAL(50,5),
    PRIMARY KEY (forcast_id)
);

