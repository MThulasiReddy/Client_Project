FROM node:22-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./
COPY --from=frontend /app/frontend/dist ./frontend_dist
RUN python manage.py collectstatic --noinput
CMD ["sh", "-c", "python manage.py migrate --noinput && daphne -b 0.0.0.0 -p $PORT college_circuit.asgi:application"]
