"""add_drift_monitoring

Revision ID: a3c1d5e8f902
Revises: 07f7d8b74e65
Create Date: 2026-02-12 12:00:00.000000

Adds model version tracking to eval_runs and creates drift monitoring
tables: drift_baselines, drift_events, drift_alert_configs,
regression_test_schedules.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision: str = 'a3c1d5e8f902'
down_revision: Union[str, None] = '07f7d8b74e65'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _column_exists(table_name: str, column_name: str) -> bool:
    """Check if a column already exists in the table."""
    bind = op.get_bind()
    insp = inspect(bind)
    columns = [c['name'] for c in insp.get_columns(table_name)]
    return column_name in columns


def _table_exists(table_name: str) -> bool:
    """Check if a table already exists."""
    bind = op.get_bind()
    insp = inspect(bind)
    return table_name in insp.get_table_names()


def upgrade() -> None:
    # --- Add model version tracking columns to eval_runs ---
    if not _column_exists('eval_runs', 'model_version'):
        op.add_column('eval_runs', sa.Column('model_version', sa.String(100), nullable=True))
    if not _column_exists('eval_runs', 'judge_model_name'):
        op.add_column('eval_runs', sa.Column('judge_model_name', sa.String(100), nullable=True))
    if not _column_exists('eval_runs', 'judge_model_version'):
        op.add_column('eval_runs', sa.Column('judge_model_version', sa.String(100), nullable=True))
    if not _column_exists('eval_runs', 'evaluation_version_id'):
        op.add_column('eval_runs', sa.Column('evaluation_version_id', sa.String(36), sa.ForeignKey('evaluation_versions.id'), nullable=True))
    if not _column_exists('eval_runs', 'is_baseline'):
        op.add_column('eval_runs', sa.Column('is_baseline', sa.Boolean(), server_default='0', nullable=False))
    if not _column_exists('eval_runs', 'baseline_run_id'):
        op.add_column('eval_runs', sa.Column('baseline_run_id', sa.String(36), nullable=True))

    # --- Create drift_baselines table ---
    if not _table_exists('drift_baselines'):
        op.create_table(
            'drift_baselines',
            sa.Column('id', sa.String(36), primary_key=True),
            sa.Column('organization_id', sa.String(36), sa.ForeignKey('organizations.id'), nullable=False),
            sa.Column('character_card_id', sa.String(36), sa.ForeignKey('character_cards.id'), nullable=False),
            sa.Column('eval_run_id', sa.String(36), sa.ForeignKey('eval_runs.id'), nullable=False),
            sa.Column('model_provider', sa.String(100), nullable=False),
            sa.Column('model_name', sa.String(100), nullable=False),
            sa.Column('model_version', sa.String(100), nullable=True),
            sa.Column('judge_model_name', sa.String(100), nullable=True),
            sa.Column('baseline_canon', sa.Numeric(5, 2)),
            sa.Column('baseline_voice', sa.Numeric(5, 2)),
            sa.Column('baseline_safety', sa.Numeric(5, 2)),
            sa.Column('baseline_legal', sa.Numeric(5, 2)),
            sa.Column('baseline_total', sa.Numeric(5, 2)),
            sa.Column('active', sa.Boolean(), nullable=False, server_default='1'),
            sa.Column('notes', sa.Text(), nullable=True),
            sa.Column('created_at', sa.DateTime()),
            sa.Column('created_by', sa.String(36), sa.ForeignKey('users.id'), nullable=True),
        )

    # --- Create drift_events table ---
    if not _table_exists('drift_events'):
        op.create_table(
            'drift_events',
            sa.Column('id', sa.String(36), primary_key=True),
            sa.Column('organization_id', sa.String(36), sa.ForeignKey('organizations.id'), nullable=False),
            sa.Column('character_card_id', sa.String(36), sa.ForeignKey('character_cards.id'), nullable=False),
            sa.Column('baseline_id', sa.String(36), sa.ForeignKey('drift_baselines.id'), nullable=False),
            sa.Column('eval_run_id', sa.String(36), sa.ForeignKey('eval_runs.id'), nullable=False),
            sa.Column('drift_type', sa.String(50)),
            sa.Column('severity', sa.String(20)),
            sa.Column('delta_canon', sa.Numeric(5, 2)),
            sa.Column('delta_voice', sa.Numeric(5, 2)),
            sa.Column('delta_safety', sa.Numeric(5, 2)),
            sa.Column('delta_legal', sa.Numeric(5, 2)),
            sa.Column('delta_total', sa.Numeric(5, 2)),
            sa.Column('old_model_version', sa.String(100)),
            sa.Column('new_model_version', sa.String(100)),
            sa.Column('summary', sa.Text()),
            sa.Column('acknowledged', sa.Boolean(), server_default='0'),
            sa.Column('acknowledged_by', sa.String(36), sa.ForeignKey('users.id'), nullable=True),
            sa.Column('acknowledged_at', sa.DateTime(), nullable=True),
            sa.Column('created_at', sa.DateTime()),
        )

    # --- Create drift_alert_configs table ---
    if not _table_exists('drift_alert_configs'):
        op.create_table(
            'drift_alert_configs',
            sa.Column('id', sa.String(36), primary_key=True),
            sa.Column('organization_id', sa.String(36), sa.ForeignKey('organizations.id'), nullable=False, unique=True),
            sa.Column('warning_threshold', sa.Numeric(5, 2), server_default='7.0'),
            sa.Column('critical_threshold', sa.Numeric(5, 2), server_default='12.0'),
            sa.Column('notify_on_warning', sa.Boolean(), server_default='1'),
            sa.Column('notify_on_critical', sa.Boolean(), server_default='1'),
            sa.Column('webhook_url', sa.String(500), nullable=True),
            sa.Column('email_recipients', sa.JSON(), nullable=True),
            sa.Column('created_at', sa.DateTime()),
            sa.Column('updated_at', sa.DateTime(), nullable=True),
        )

    # --- Create regression_test_schedules table ---
    if not _table_exists('regression_test_schedules'):
        op.create_table(
            'regression_test_schedules',
            sa.Column('id', sa.String(36), primary_key=True),
            sa.Column('organization_id', sa.String(36), sa.ForeignKey('organizations.id'), nullable=False),
            sa.Column('character_card_id', sa.String(36), sa.ForeignKey('character_cards.id'), nullable=False),
            sa.Column('test_suite_id', sa.String(36), sa.ForeignKey('test_suites.id'), nullable=False),
            sa.Column('model_provider', sa.String(100), nullable=False),
            sa.Column('model_names', sa.JSON(), nullable=False),
            sa.Column('baseline_id', sa.String(36), sa.ForeignKey('drift_baselines.id'), nullable=False),
            sa.Column('frequency', sa.String(50), server_default='weekly'),
            sa.Column('last_run_at', sa.DateTime(), nullable=True),
            sa.Column('next_run_at', sa.DateTime(), nullable=True),
            sa.Column('enabled', sa.Boolean(), server_default='1'),
            sa.Column('created_at', sa.DateTime()),
        )


def downgrade() -> None:
    op.drop_table('regression_test_schedules')
    op.drop_table('drift_alert_configs')
    op.drop_table('drift_events')
    op.drop_table('drift_baselines')

    if _column_exists('eval_runs', 'baseline_run_id'):
        op.drop_column('eval_runs', 'baseline_run_id')
    if _column_exists('eval_runs', 'is_baseline'):
        op.drop_column('eval_runs', 'is_baseline')
    if _column_exists('eval_runs', 'evaluation_version_id'):
        op.drop_column('eval_runs', 'evaluation_version_id')
    if _column_exists('eval_runs', 'judge_model_version'):
        op.drop_column('eval_runs', 'judge_model_version')
    if _column_exists('eval_runs', 'judge_model_name'):
        op.drop_column('eval_runs', 'judge_model_name')
    if _column_exists('eval_runs', 'model_version'):
        op.drop_column('eval_runs', 'model_version')
