#  🚀 ITBP Sentinel AI - Command Center Dashboard

An AI-powered *Command Center Dashboard* for border surveillance and threat monitoring, designed for the Indo-Tibetan Border Police (ITBP).

## 🎯 Features

- Real-time anomaly detection
- Interactive map with border posts
- Add, Edit, and Delete anomalies
- Social media intelligence feed
- Threat detection with Critical/All filters
- Route optimization
- Live surveillance feed simulation
- Central agency coordination
- User authentication with JWT

## 🛠️ Technologies Used

- *Frontend:* HTML, CSS, JavaScript, TailwindCSS
- *Backend:* Python, Flask, FastAPI
- *Database:* SQLite
- *APIs:* REST APIs
- *Authentication:* JWT (JSON Web Token)
- *Maps:* Leaflet.js, OpenStreetMap

 🚀 HOW TO RUN

 1. Clone the repository
```bash
git clone https://github.com/avishekmoharana1-oss/ITBP-Sentinel-AI.git
2. Go to the project folder
cd ITBP-Sentinel-AI
3. Install dependencies
pip install -r requirements.txt
4. Run the backend server
python -m uvicorn main:app --reload --port 8000
5. Run the frontend server
Open another terminal:
cd frontend
python -m http.server 8001
6. Open the dashboard
Open your browser and go to:
http://127.0.0.1:8001

🔑 *HOW TO LOGIN*

1. Register a user
Open:
http://127.0.0.1:8000/docs
Use:
POST /api/auth/register
Example:
{
"username": "admin",
"email": "admin@gmail.com",
"password": "admin123",
"full_name": "Admin User",
"role": "admin"
}


2. Login
Use:
POST /api/auth/login
{
"username": "admin",
"password": "admin123"
}
Copy the generated access_token.


3. Load dashboard data
On the dashboard:
Click Load Data
Paste the access token
Click OK

📌 API ENDPOINTS

METHOD       ENDPOINT                 DESCRIPTION
                 
POST      /api/auth/register        Register a new user
POST      /api/auth/login           Login and get token
GET       /api/incidents            Get all incidents
POST      /api/incidents            Create a new incident 
PUT       /api/incidents/{id}       Update an incident
DELETE    /api/incidents/{id}       Delete an incident
GET       /api/dashboard/stats      Get dashboard statistics 

📸 DASHBOARD SECTIONS

1. Dashboard
:Live map with border tracking
:Real-time anomalies list
:Add/Edit/Delete anomalies
:Operation alerts

2. Surveillance
:Camera array status
:Live feed simulation
:Thermal vision display

3. Threat Detection
:Computer vision analysis
:Incident timeline
:Critical/All alerts filter

4. Route Optimization
:Patrol route map
:Terrain difficulty slider
:Optimized route calculation

5. Intel & Social
:Social media intelligence feed
:Add posts
:Sentiment analysis
:AI confidence scoring

6. Central Agency
:Multi-agency coordination
:Resource request management
:Start new operations
:Active operations list

👨‍💻 AUTHOR

**Avishek Moharana**
