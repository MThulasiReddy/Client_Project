# ============================================================
# Stage 1: Build React/Vite frontend
# ============================================================
FROM node:22-alpine AS frontend

WORKDIR /app/frontend

# Copy package files first for better Docker layer caching
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build React/Vite production files
RUN npm run build


# ============================================================
# Stage 2: Django backend
# ============================================================
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app/backend

# ------------------------------------------------------------
# Install Python dependencies
# ------------------------------------------------------------
COPY backend/requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

# ------------------------------------------------------------
# Copy Django backend
# ------------------------------------------------------------
COPY backend/ ./

# ------------------------------------------------------------
# Copy React/Vite production build into Django project
# ------------------------------------------------------------
COPY --from=frontend /app/frontend/dist ./frontend_dist

# ------------------------------------------------------------
# Collect Django static files
# ------------------------------------------------------------
RUN python manage.py collectstatic --noinput

# ------------------------------------------------------------
# Make startup script executable
# ------------------------------------------------------------
RUN chmod +x start.sh

# ------------------------------------------------------------
# Start Django + migrations + admin creation + Daphne
# ------------------------------------------------------------
CMD ["./start.sh"]