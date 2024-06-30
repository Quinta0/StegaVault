import pytest
from ..app import create_app, db
from ..app.models.user import User


@pytest.fixture
def client():
    app = create_app('testing')
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()


def test_register(client):
    response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'password': 'testpass'
    })
    assert response.status_code == 201
    assert b"User created successfully" in response.data


def test_login(client):
    # First register a user
    client.post('/api/auth/register', json={
        'username': 'testuser',
        'password': 'testpass'
    })

    # Then try to log in
    response = client.post('/api/auth/login', json={
        'username': 'testuser',
        'password': 'testpass'
    })
    assert response.status_code == 200
    assert 'token' in response.json