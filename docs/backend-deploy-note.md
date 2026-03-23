# LogiQ Supply Chain - Backend Deployment Note

This document summarizes the steps and configuration used to set up the Spring Boot backend for deployment on Render.

## Hosting Platform
**Recommended:** [Render](https://render.com) or [Railway](https://railway.app)

## Deployment Details
- **URL:** [To be updated after deployment] (e.g., `https://logiq-backend.onrender.com`)
- **Main Branch:** `main`
- **Build Command:** `./mvnw clean install -DskipTests`
- **Start Command:** `java -jar target/backend-0.0.1-SNAPSHOT.jar`

## Environment Variables Needed
| Variable | Default/Example | Description |
|---|---|---|
| `PORT` | `8080` | Port the application listens on (set automatically by hosting) |
| `SPRING_DATASOURCE_URL` | `jdbc:h2:mem:logiq_db` | Database URL. Set to a persistent file or managed DB if needed. |
| `UPLOAD_PATH` | `./uploads/receipts` | Folder for file uploads. Use `/tmp` or persistent disk if available. |

## Known Limitations
1. **Ephemeral Storage:** The current setup uses a local folder (`./uploads/receipts`) for bank transfer receipt uploads. On Render and Railway, this storage is ephemeral and will be cleared on each redeploy or restart. For a production environment, recommend using AWS S3 or Cloudinary.
2. **In-Memory Database:** The default configuration uses an in-memory H2 database. Data will be lost upon restart. To persist data, either configure a persistent H2 file path with a volume or connect to a managed PostgreSQL/MySQL instance.
3. **Seeded Data:** The application automatically seeds initial products and demo users (`admin@msr.com`, `customer@example.com`) if the database is empty.

## Tested Endpoints
- ✅ `GET /api/health`: Basic health check.
- ✅ `GET /api/products`: Public listing of catalog items.
- ✅ `POST /api/auth/login`: Authentication with JWT.
- ✅ `GET /api/orders/{id}/tracking/customer`: Order tracking flow.

## Deployment Config Added
- `render.yaml`: Configuration for one-click or automatic deployment on Render.
- `HealthController.java`: Added for deployment monitoring.
