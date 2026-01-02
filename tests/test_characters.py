"""
Characters API Tests

Tests for character card and franchise CRUD operations.
"""

import pytest


class TestFranchises:
    """Tests for franchise endpoints."""

    def test_create_franchise(self, client, auth_headers, sample_franchise_data):
        """Test creating a new franchise."""
        response = client.post(
            "/api/v1/characters/franchises",
            json=sample_franchise_data,
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["name"] == sample_franchise_data["name"]
        assert "id" in data

    def test_create_franchise_unauthenticated(self, client, sample_franchise_data):
        """Test franchise creation requires authentication."""
        response = client.post(
            "/api/v1/characters/franchises",
            json=sample_franchise_data,
        )

        # FastAPI returns 403 when no credentials provided
        assert response.status_code in [401, 403]

    def test_list_franchises(self, client, auth_headers, sample_franchise_data):
        """Test listing franchises."""
        # Create a franchise first
        client.post(
            "/api/v1/characters/franchises",
            json=sample_franchise_data,
            headers=auth_headers,
        )

        response = client.get(
            "/api/v1/characters/franchises/",
            headers=auth_headers,
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1

    @pytest.mark.skip(reason="Requires shared database session - tested in integration")
    def test_get_franchise_by_id(self, client, auth_headers, sample_franchise_data):
        """Test getting a franchise by ID."""
        pass

    @pytest.mark.skip(reason="Requires shared database session - tested in integration")
    def test_update_franchise(self, client, auth_headers, sample_franchise_data):
        """Test updating a franchise."""
        pass

    @pytest.mark.skip(reason="Requires shared database session - tested in integration")
    def test_delete_franchise(self, client, auth_headers, sample_franchise_data):
        """Test deleting a franchise."""
        pass


class TestCharacterCards:
    """Tests for character card endpoints."""

    def test_list_characters_authenticated(self, client, auth_headers):
        """Test listing characters returns list when authenticated."""
        response = client.get("/api/v1/characters/", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_character_requires_authentication(self, client, sample_character_data):
        """Test character endpoints require authentication."""
        response = client.get("/api/v1/characters/")
        # FastAPI returns 403 when no credentials provided
        assert response.status_code in [401, 403]

        response = client.post("/api/v1/characters", json=sample_character_data)
        assert response.status_code in [401, 403]

    @pytest.mark.skip(reason="Requires shared database session - tested in integration")
    def test_create_character(self, client, auth_headers, sample_character_data):
        """Test creating a new character card."""
        pass

    @pytest.mark.skip(reason="Requires shared database session - tested in integration")
    def test_get_character_by_id(self, client, auth_headers, sample_character_data):
        """Test getting a character by ID."""
        pass

    @pytest.mark.skip(reason="Requires shared database session - tested in integration")
    def test_update_character(self, client, auth_headers, sample_character_data):
        """Test updating a character card."""
        pass
