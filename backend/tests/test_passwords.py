import pytest
from ..app import create_app, db
from ..app.models.user import User
from ..app.models.password import Password


@pytest.fixture
def client():
    app = create_app('testing')
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()


@pytest.fixture
def auth_token(client):
    client.post('/api/auth/register', json={
        'username': 'testuser',
        'password': 'testpass'
    })
    response = client.post('/api/auth/login', json={
        'username': 'testuser',
        'password': 'testpass'
    })
    return response.json['token']


def test_add_password(client, auth_token):
    response = client.post('/api/passwords',
                           headers={'Authorization': auth_token},
                           json={
                               'site': 'example.com',
                               'username': 'user123',
                               'password': 'securepass123'
                           })
    assert response.status_code == 201
    assert b"Password added successfully" in response.data


def test_get_passwords(client, auth_token):
    # First add a password
    client.post('/api/passwords',
                headers={'Authorization': auth_token},
                json={
                    'site': 'example.com',
                    'username': 'user123',
                    'password': 'securepass123'
                })

    # Then retrieve passwords
    response = client.get('/api/passwords',
                          headers={'Authorization': auth_token})
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['site'] == 'example.com'
    assert response.json[0]['username'] == 'user123'