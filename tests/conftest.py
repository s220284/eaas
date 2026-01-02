"""
Pytest configuration and fixtures for CanonSafe tests.

Provides database setup, test client, and authentication helpers.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from src.main import app
from src.database import Base, get_db


# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def db_session():
    """
    Create a fresh database session for each test.

    Creates all tables before the test and drops them after.
    """
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """
    Create a test client with database override.

    Args:
        db_session: The test database session fixture

    Returns:
        TestClient: FastAPI test client configured for testing
    """
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_user_data():
    """Sample user registration data."""
    return {
        "email": "test@example.com",
        "password": "TestPassword123!",
        "name": "Test User",
        "organization_name": "Test Organization",
        "organization_slug": "test-org",
    }


@pytest.fixture
def registered_user(client, test_user_data):
    """
    Register a test user and return credentials.

    Args:
        client: Test client fixture
        test_user_data: User data fixture

    Returns:
        dict: Contains user data and access token
    """
    response = client.post("/api/v1/auth/register", json=test_user_data)
    assert response.status_code == 200
    data = response.json()
    return {
        **test_user_data,
        "access_token": data["access_token"],
    }


@pytest.fixture
def auth_headers(registered_user):
    """
    Get authorization headers for authenticated requests.

    Args:
        registered_user: Registered user fixture

    Returns:
        dict: Headers with Bearer token
    """
    return {"Authorization": f"Bearer {registered_user['access_token']}"}


@pytest.fixture
def sample_character_data():
    """Sample character card data for testing."""
    return {
        "name": "Test Character",
        "slug": "test-character",
        "canon_facts": {
            "full_name": {"value": "Test Character Full Name", "source": "Test Source"},
            "origin": {"value": "Test Origin", "source": "Test Source"},
        },
        "canon_voice": {
            "personality": "Friendly and helpful",
            "tone": "Warm and encouraging",
            "speech_style": "Casual and approachable",
        },
        "canon_relationships": [
            {"entity": "Friend Character", "relationship": "Best friend"},
        ],
        "safety_content_rating": "G",
        "safety_prohibited_topics": ["violence", "adult_content"],
        "safety_required_disclosures": ["This is an AI-generated character experience"],
    }


@pytest.fixture
def sample_franchise_data():
    """Sample franchise data for testing."""
    return {
        "name": "Test Franchise",
        "description": "A test franchise for unit testing",
    }
