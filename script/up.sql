-- Create device_type_enum first
CREATE TYPE device_type_enum AS ENUM ('fan', 'light', 'AC');

-- Create devices table
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_name TEXT NOT NULL,
    device_type device_type_enum NOT NULL,
    is_on BOOLEAN NOT NULL DEFAULT FALSE,
    fan_speed INTEGER, -- Applicable only for 'fan' type
    temperature INTEGER, -- Applicable only for 'AC' type

    -- Constraints to ensure type-specific attributes are correctly managed
    -- A fan must have fan_speed, and not temperature
    CONSTRAINT chk_fan_attributes
        CHECK (
            (device_type = 'fan' AND fan_speed IS NOT NULL AND temperature IS NULL) OR
            (device_type != 'fan' AND fan_speed IS NULL)
        ),
    -- An AC must have temperature, and not fan_speed
    CONSTRAINT chk_ac_attributes
        CHECK (
            (device_type = 'AC' AND temperature IS NOT NULL AND fan_speed IS NULL) OR
            (device_type != 'AC' AND temperature IS NULL)
        ),
    -- A light must not have fan_speed or temperature
    CONSTRAINT chk_light_attributes
        CHECK (
            (device_type = 'light' AND fan_speed IS NULL AND temperature IS NULL) OR
            (device_type != 'light')
        )
);

-- Example: Add some initial data (optional, but good for testing)
INSERT INTO devices (device_name, device_type, is_on, fan_speed) VALUES
('Living Room Fan', 'fan', TRUE, 3);

INSERT INTO devices (device_name, device_type, is_on) VALUES
('Kitchen Light', 'light', FALSE);

INSERT INTO devices (device_name, device_type, is_on, temperature) VALUES
('Bedroom AC', 'AC', TRUE, 22);
