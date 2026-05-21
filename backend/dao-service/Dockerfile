FROM python:3.11-slim
WORKDIR /app
COPY backend/dao-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ /app/backend/
COPY dao/ /app/dao/
COPY frontends/dao-dashboard/ /app/frontends/dao-dashboard/
ENV PYTHONPATH=/app:/app/backend/fth-academy:/app/backend/shared
CMD ["python", "backend/dao-service/main.py"]
