"""
Set main character flags for core Peppa Pig characters.

Main characters: Peppa Pig, George Pig, Mummy Pig, Daddy Pig, Suzy Sheep,
Grandpa Pig, Granny Pig, Miss Rabbit, Pedro Pony, Rebecca Rabbit.
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.database import SessionLocal
from src.models import CharacterCard

MAIN_CHARACTER_NAMES = [
    "Peppa Pig",
    "George Pig",
    "Mummy Pig",
    "Daddy Pig",
    "Suzy Sheep",
    "Grandpa Pig",
    "Granny Pig",
    "Miss Rabbit",
    "Pedro Pony",
    "Rebecca Rabbit",
]


def set_main_characters():
    db = SessionLocal()
    try:
        # Reset all characters to non-main first
        db.query(CharacterCard).update({CharacterCard.is_main_character: False})

        # Set main characters
        updated = 0
        for name in MAIN_CHARACTER_NAMES:
            card = db.query(CharacterCard).filter(CharacterCard.name == name).first()
            if card:
                card.is_main_character = True
                updated += 1
                print(f"  [MAIN] {name}")
            else:
                print(f"  [SKIP] {name} - not found")

        db.commit()
        print(f"\nSet {updated}/{len(MAIN_CHARACTER_NAMES)} main characters.")
    finally:
        db.close()


if __name__ == "__main__":
    set_main_characters()
