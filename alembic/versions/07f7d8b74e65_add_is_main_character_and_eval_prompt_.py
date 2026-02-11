"""add_is_main_character_and_eval_prompt_fields

Revision ID: 07f7d8b74e65
Revises: e9bbe2a25220
Create Date: 2026-02-11 09:28:30.784391

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision: str = '07f7d8b74e65'
down_revision: Union[str, None] = 'e9bbe2a25220'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _column_exists(table_name: str, column_name: str) -> bool:
    """Check if a column already exists in the table."""
    bind = op.get_bind()
    insp = inspect(bind)
    columns = [c['name'] for c in insp.get_columns(table_name)]
    return column_name in columns


def upgrade() -> None:
    # Only add columns that don't already exist (image_url may already be present)
    if not _column_exists('character_cards', 'image_url'):
        op.add_column('character_cards', sa.Column('image_url', sa.String(length=500), nullable=True))
    if not _column_exists('character_cards', 'is_main_character'):
        op.add_column('character_cards', sa.Column('is_main_character', sa.Boolean(), nullable=True))
    if not _column_exists('eval_runs', 'prompt'):
        op.add_column('eval_runs', sa.Column('prompt', sa.Text(), nullable=True))
    if not _column_exists('eval_runs', 'model_response'):
        op.add_column('eval_runs', sa.Column('model_response', sa.Text(), nullable=True))
    if not _column_exists('franchises', 'image_url'):
        op.add_column('franchises', sa.Column('image_url', sa.String(length=500), nullable=True))

    # Default all existing rows to False, then set main characters
    character_cards = sa.table(
        'character_cards',
        sa.column('name', sa.String),
        sa.column('is_main_character', sa.Boolean),
    )
    op.execute(
        character_cards.update().values(is_main_character=False)
    )
    main_names = [
        'Peppa Pig', 'George Pig', 'Mummy Pig', 'Daddy Pig', 'Suzy Sheep',
        'Grandpa Pig', 'Granny Pig', 'Miss Rabbit', 'Pedro Pony', 'Rebecca Rabbit',
    ]
    op.execute(
        character_cards.update()
        .where(character_cards.c.name.in_(main_names))
        .values(is_main_character=True)
    )


def downgrade() -> None:
    if _column_exists('franchises', 'image_url'):
        op.drop_column('franchises', 'image_url')
    op.drop_column('eval_runs', 'model_response')
    op.drop_column('eval_runs', 'prompt')
    op.drop_column('character_cards', 'is_main_character')
    if _column_exists('character_cards', 'image_url'):
        op.drop_column('character_cards', 'image_url')
