-- Add image_url column to character_cards table
ALTER TABLE character_cards ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Update Peppa Pig characters with placeholder images
UPDATE character_cards
SET image_url = 'https://upload.wikimedia.org/wikipedia/en/c/c2/Peppa_Pig_character.png'
WHERE name = 'Peppa Pig';

UPDATE character_cards
SET image_url = 'https://upload.wikimedia.org/wikipedia/en/thumb/8/82/George_Pig.png/200px-George_Pig.png'
WHERE name = 'George Pig';

UPDATE character_cards
SET image_url = 'https://static.wikia.nocookie.net/peppapedia/images/8/8f/Mummy_Pig.png'
WHERE name = 'Mummy Pig';

UPDATE character_cards
SET image_url = 'https://static.wikia.nocookie.net/peppapedia/images/4/42/Daddy_Pig.png'
WHERE name = 'Daddy Pig';

UPDATE character_cards
SET image_url = 'https://static.wikia.nocookie.net/peppapedia/images/f/f8/Suzy_Sheep.png'
WHERE name = 'Suzy Sheep';
