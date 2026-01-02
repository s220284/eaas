"""
Evaluations API Tests

Tests for the LLM-as-Judge evaluation system.
"""

import pytest


class TestQuickEvaluation:
    """Tests for the quick evaluation endpoint."""

    @pytest.mark.skip(reason="Requires shared database session - tested in integration")
    def test_evaluate_response(self, client, auth_headers):
        """Test evaluating a model response against a character card."""
        pass

    def test_evaluate_requires_authentication(self, client):
        """Test evaluation endpoint requires authentication."""
        response = client.post(
            "/api/v1/evaluations/evaluate",
            json={
                "character_card_id": "00000000-0000-0000-0000-000000000000",
                "prompt": "Hello",
                "model_response": "Hi",
            },
        )

        # FastAPI returns 403 when no credentials provided
        assert response.status_code in [401, 403]

    def test_evaluate_invalid_character(self, client, auth_headers):
        """Test evaluation fails with invalid character ID."""
        response = client.post(
            "/api/v1/evaluations/evaluate",
            json={
                "character_card_id": "00000000-0000-0000-0000-000000000000",
                "prompt": "Hello",
                "model_response": "Hi",
            },
            headers=auth_headers,
        )

        assert response.status_code == 404


class TestTestSuites:
    """Tests for test suite management."""

    def test_list_test_suites(self, client, auth_headers):
        """Test listing test suites returns list."""
        response = client.get(
            "/api/v1/evaluations/test-suites",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    @pytest.mark.skip(reason="Requires shared database session - tested in integration")
    def test_create_test_suite(self, client, auth_headers):
        """Test creating a test suite with test cases."""
        pass


class TestHealthCheck:
    """Tests for health check endpoints."""

    def test_root_endpoint(self, client):
        """Test root endpoint returns ok status."""
        response = client.get("/")

        assert response.status_code == 200
        assert response.json()["status"] == "ok"

    def test_health_endpoint(self, client):
        """Test health endpoint returns detailed status."""
        response = client.get("/health")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data
