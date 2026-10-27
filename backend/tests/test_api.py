import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "version" in data

def test_dashboard_summary():
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "summaryCards" in data
    assert "analytics" in data

def test_project_crud():
    payload = {
        "name": "Automated Test Project",
        "location": "Denver, CO",
        "client": "Test Client",
        "manager": "Jane Doe, PE",
        "budget": 5000000,
        "project_type": "Commercial"
    }
    create_res = client.post("/api/projects", json=payload)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["name"] == "Automated Test Project"
    assert "id" in created_data
