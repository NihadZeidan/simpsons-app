Drop Table if exists simp;

Create Table simp (
    id SERIAL PRIMARY KEY,
    quote TEXt,
    character VARCHAR(255),
    image TEXT,
    characterDirection VARCHAR(255)
);