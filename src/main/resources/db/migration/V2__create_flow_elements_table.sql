CREATE TABLE flow_elements (
                               id SERIAL PRIMARY KEY,
                               flow_id INTEGER NOT NULL,
                               name VARCHAR(255) NOT NULL,
                               CONSTRAINT fk_flow FOREIGN KEY (flow_id) REFERENCES flows(id) ON DELETE CASCADE
);