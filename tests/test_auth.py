"""
Authentication API Tests

Tests for user registration, login, and profile endpoints.
"""

import pytest


class TestRegistration:
    """Tests for the /api/v1/auth/register endpoint."""

    def test_register_success(self, client, test_user_data):
        """Test successful user registration."""
        response = client.post("/api/v1/auth/register", json=test_user_data)

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_register_duplicate_email(self, client, test_user_data):
        """Test registration fails with duplicate email."""
        # First registration
        client.post("/api/v1/auth/register", json=test_user_data)

        # Second registration with same email
        response = client.post("/api/v1/auth/register", json=test_user_data)

        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()

    def test_register_invalid_email(self, client, test_user_data):
        """Test registration fails with invalid email format."""
        test_user_data["email"] = "invalid-email"
        response = client.post("/api/v1/auth/register", json=test_user_data)

        assert response.status_code == 422  # Validation error

    def test_register_missing_fields(self, client):
        """Test registration fails with missing required fields."""
        response = client.post("/api/v1/auth/register", json={})

        assert response.status_code == 422


class TestLogin:
    """Tests for the /api/v1/auth/login endpoint."""

    def test_login_success(self, client, registered_user):
        """Test successful login with valid credentials."""
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": registered_user["email"],
                "password": registered_user["password"],
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client, registered_user):
        """Test login fails with wrong password."""
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": registered_user["email"],
                "password": "WrongPassword123!",
            },
        )

        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()

    def test_login_nonexistent_user(self, client):
        """Test login fails for non-existent user."""
        response = client.post(
            "/api/v1/auth/login",
            json={
                "email": "nonexistent@example.com",
                "password": "SomePassword123!",
            },
        )

        assert response.status_code == 401


class TestProfile:
    """Tests for the /api/v1/auth/me endpoint."""

    def test_get_profile_authenticated(self, client, registered_user, auth_headers):
        """Test getting profile with valid token."""
        response = client.get("/api/v1/auth/me", headers=auth_headers)

        assert response.status_code == 200
        data = response.json()
        assert data["email"] == registered_user["email"]
        assert data["name"] == registered_user["name"]

    def test_get_profile_unauthenticated(self, client):
        """Test profile endpoint requires authentication."""
        response = client.get("/api/v1/auth/me")

        # FastAPI returns 403 when no credentials provided
        assert response.status_code in [401, 403]

    def test_get_profile_invalid_token(self, client):
        """Test profile endpoint rejects invalid token."""
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer invalid-token"},
        )

        assert response.status_code == 401
