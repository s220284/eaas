"""make_test_suite_id_nullable

Revision ID: e9bbe2a25220
Revises: 
Create Date: 2026-02-04 21:43:35.466028

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e9bbe2a25220'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Make test_suite_id nullable to support quick evaluations
    op.alter_column('eval_runs', 'test_suite_id',
                    existing_type=sa.String(36),
                    nullable=True)


def downgrade() -> None:
    # Make test_suite_id NOT NULL again
    op.alter_column('eval_runs', 'test_suite_id',
                    existing_type=sa.String(36),
                    nullable=False)
