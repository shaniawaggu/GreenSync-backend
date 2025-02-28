DROP TABLE IF EXISTS users, forecasts;

CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    postcode VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- should be created automatically
    PRIMARY KEY (user_id)
);

CREATE TABLE forecasts (
    forecast_id INT GENERATED ALWAYS AS IDENTITY,
    dateAndTime VARCHAR(25),
    estimatedEnergy DECIMAL(50,5),
    windEnergy DECIMAL(50,5),
    solarEnergy DECIMAL(50,5),
    PRIMARY KEY (forecast_id)
);

CREATE TABLE ActivePowerData (
    active_power_id INT GENERATED ALWAYS AS IDENTITY,
    date_time DATETIME,
    active_power_avg FLOAT,
    PRIMARY KEY (active_power_id)
);

INSERT INTO ActivePowerData (date_time, active_power_avg) VALUES
('2025-01-13 00:00:00', 12244.35),
('2025-01-13 01:00:00', 9069.11),
('2025-01-13 02:00:00', 8740.25),
('2025-01-13 03:00:00', 8616.73),
('2025-01-13 04:00:00', 8343.69),
('2025-01-13 05:00:00', 8321.92),
('2025-01-13 06:00:00', 8915.460000000001),
('2025-01-13 07:00:00', 10910.32),
('2025-01-13 08:00:00', 12552.64),
('2025-01-13 09:00:00', 13133.43),
('2025-01-13 10:00:00', 13559.75),
('2025-01-13 11:00:00', 13261.8),
('2025-01-13 12:00:00', 13356.64),
('2025-01-13 13:00:00', 13577.26),
('2025-01-13 14:00:00', 13494.4),
('2025-01-13 15:00:00', 13591.01),
('2025-01-13 16:00:00', 14374.619999999999),
('2025-01-13 17:00:00', 14730.53),
('2025-01-13 18:00:00', 14808.35),
('2025-01-13 19:00:00', 14601.04),
('2025-01-13 20:00:00', 14939.53),
('2025-01-13 21:00:00', 14547.0),
('2025-01-13 22:00:00', 13584.31),
('2025-01-13 23:00:00', 12454.81),
('2025-01-14 00:00:00', 11639.94),
('2025-01-14 01:00:00', 9385.32),
('2025-01-14 02:00:00', 8999.1),
('2025-01-14 03:00:00', 8861.01),
('2025-01-14 04:00:00', 8823.35),
('2025-01-14 05:00:00', 8696.39),
('2025-01-14 06:00:00', 9181.18),
('2025-01-14 07:00:00', 10882.81),
('2025-01-14 08:00:00', 12712.51),
('2025-01-14 09:00:00', 13161.59),
('2025-01-14 10:00:00', 13669.02),
('2025-01-14 11:00:00', 13580.18),
('2025-01-14 12:00:00', 13130.8),
('2025-01-14 13:00:00', 13252.37),
('2025-01-14 14:00:00', 13209.45),
('2025-01-14 15:00:00', 13414.2),
('2025-01-14 16:00:00', 13749.76),
('2025-01-14 17:00:00', 14075.289999999999),
('2025-01-14 18:00:00', 14121.49),
('2025-01-14 19:00:00', 14253.5),
('2025-01-14 20:00:00', 13844.07),
('2025-01-14 21:00:00', 14017.69),
('2025-01-14 22:00:00', 12929.66),
('2025-01-14 23:00:00', 12546.14),
('2025-01-15 00:00:00', 11978.12),
('2025-01-15 01:00:00', 9177.630000000001),
('2025-01-15 02:00:00', 8822.58),
('2025-01-15 03:00:00', 8467.92),
('2025-01-15 04:00:00', 8245.44),
('2025-01-15 05:00:00', 8295.97),
('2025-01-15 06:00:00', 9380.31),
('2025-01-15 07:00:00', 11097.86),
('2025-01-15 08:00:00', 12198.13),
('2025-01-15 09:00:00', 12650.62),
('2025-01-15 10:00:00', 13423.34),
('2025-01-15 11:00:00', 13500.37),
('2025-01-15 12:00:00', 13592.14),
('2025-01-15 13:00:00', 13918.39),
('2025-01-15 14:00:00', 13601.58),
('2025-01-15 15:00:00', 13547.1),
('2025-01-15 16:00:00', 13567.31),
('2025-01-15 17:00:00', 13860.92),
('2025-01-15 18:00:00', 14127.98),
('2025-01-15 19:00:00', 13639.26),
('2025-01-15 20:00:00', 13094.26),
('2025-01-15 21:00:00', 13118.68),
('2025-01-15 22:00:00', 12049.64),
('2025-01-15 23:00:00', 11086.74),
('2025-01-16 00:00:00', 10948.38),
('2025-01-16 01:00:00', 9055.34),
('2025-01-16 02:00:00', 8651.99),
('2025-01-16 03:00:00', 8390.05),
('2025-01-16 04:00:00', 8271.38),
('2025-01-16 05:00:00', 8396.57),
('2025-01-16 06:00:00', 9034.04),
('2025-01-16 07:00:00', 10610.59),
('2025-01-16 08:00:00', 11647.53),
('2025-01-16 09:00:00', 12217.04),
('2025-01-16 10:00:00', 12925.4),
('2025-01-16 11:00:00', 12850.27),
('2025-01-16 12:00:00', 12855.47),
('2025-01-16 13:00:00', 13297.19),
('2025-01-16 14:00:00', 13417.1),
('2025-01-16 15:00:00', 13361.54),
('2025-01-16 16:00:00', 13335.09),
('2025-01-16 17:00:00', 13788.36),
('2025-01-16 18:00:00', 14053.43),
('2025-01-16 19:00:00', 13807.03),
('2025-01-16 20:00:00', 13642.14),
('2025-01-16 21:00:00', 13298.66),
('2025-01-16 22:00:00', 12674.76),
('2025-01-16 23:00:00', 11721.87),
('2025-01-17 00:00:00', 11399.18),
('2025-01-17 01:00:00', 8900.8),
('2025-01-17 02:00:00', 8662.17),
('2025-01-17 03:00:00', 8442.23),
('2025-01-17 04:00:00', 8209.51),
('2025-01-17 05:00:00', 8188.0),
('2025-01-17 06:00:00', 8888.77),
('2025-01-17 07:00:00', 10334.74),
('2025-01-17 08:00:00', 12133.65),
('2025-01-17 09:00:00', 12944.1),
('2025-01-17 10:00:00', 13531.35),
('2025-01-17 11:00:00', 13826.94),
('2025-01-17 12:00:00', 13966.19),
('2025-01-17 13:00:00', 14314.65),
('2025-01-17 14:00:00', 14193.03),
('2025-01-17 15:00:00', 14467.27),
('2025-01-17 16:00:00', 14341.12),
('2025-01-17 17:00:00', 14366.33),
('2025-01-17 18:00:00', 14542.1),
('2025-01-17 19:00:00', 14475.57),
('2025-01-17 20:00:00', 15000.73),
('2025-01-17 21:00:00', 14487.81),
('2025-01-17 22:00:00', 13515.94),
('2025-01-17 23:00:00', 12821.75),
('2025-01-18 00:00:00', 12796.72),
('2025-01-18 01:00:00', 9730.58),
('2025-01-18 02:00:00', 9328.74),
('2025-01-18 03:00:00', 9144.39),
('2025-01-18 04:00:00', 8738.83),
('2025-01-18 05:00:00', 8758.91),
('2025-01-18 06:00:00', 8929.38),
('2025-01-18 07:00:00', 9528.0),
('2025-01-18 08:00:00', 10165.62),
('2025-01-18 09:00:00', 11036.11),
('2025-01-18 10:00:00', 11903.83),
('2025-01-18 11:00:00', 12471.47),
('2025-01-18 12:00:00', 13173.19),
('2025-01-18 13:00:00', 13267.22),
('2025-01-18 14:00:00', 13270.82),
('2025-01-18 15:00:00', 13233.460000000001),
('2025-01-18 16:00:00', 13255.17),
('2025-01-18 17:00:00', 13635.28),
('2025-01-18 18:00:00', 13693.76),
('2025-01-18 19:00:00', 13922.67),
('2025-01-18 20:00:00', 13701.84),
('2025-01-18 21:00:00', 13235.95),
('2025-01-18 22:00:00', 13139.46),
('2025-01-18 23:00:00', 12325.08),
('2025-01-19 00:00:00', 12466.25),
('2025-01-19 01:00:00', 9770.99),
('2025-01-19 02:00:00', 9171.78),
('2025-01-19 03:00:00', 8997.61),
('2025-01-19 04:00:00', 8720.6),
('2025-01-19 05:00:00', 8538.19),
('2025-01-19 06:00:00', 8590.47),
('2025-01-19 07:00:00', 8913.89),
('2025-01-19 08:00:00', 9448.71),
('2025-01-19 09:00:00', 10723.4),
('2025-01-19 10:00:00', 11823.45),
('2025-01-19 11:00:00', 12729.23),
('2025-01-19 12:00:00', 13253.37),
('2025-01-19 13:00:00', 13538.72),
('2025-01-19 14:00:00', 13518.039999999999),
('2025-01-19 15:00:00', 13900.49),
('2025-01-19 16:00:00', 14030.54),
('2025-01-19 17:00:00', 14376.01),
('2025-01-19 18:00:00', 14641.99),
('2025-01-19 19:00:00', 14313.48),
('2025-01-19 20:00:00', 14244.99),
('2025-01-19 21:00:00', 13751.15),
('2025-01-19 22:00:00', 13182.41),
('2025-01-19 23:00:00', 12626.13),
('2025-01-20 00:00:00', 12469.74),
('2025-01-20 01:00:00', 4455.9),
('2025-01-20 02:00:00', 4259.93),
('2025-01-20 03:00:00', 4152.73),
('2025-01-20 04:00:00', 4102.72),
('2025-01-20 05:00:00', 4123.62),
('2025-01-20 06:00:00', 4495.59),
('2025-01-20 07:00:00', 5376.82),
('2025-01-20 08:00:00', 6215.88),
('2025-01-20 09:00:00', 6652.02),
('2025-01-20 10:00:00', 6944.29),
('2025-01-20 11:00:00', 7027.26),
('2025-01-20 12:00:00', 7002.69),
('2025-01-20 13:00:00', 7038.55),
('2025-01-20 14:00:00', 6922.93),
('2025-01-20 15:00:00', 6918.6),
('2025-01-20 16:00:00', 6948.87),
('2025-01-20 17:00:00', 7115.56),
('2025-01-20 18:00:00', 7233.139999999999),
('2025-01-20 19:00:00', 7243.33),
('2025-01-20 20:00:00', 6786.25),
('2025-01-20 21:00:00', 6221.02),
('2025-01-20 22:00:00', 5642.12),
('2025-01-20 23:00:00', 5050.24);
