# One image, one process. Capstone 2 splits the worker out; this does not.
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY pyproject.toml ./
COPY src ./src
RUN pip install --upgrade pip && pip install .

# The corpus ships in the image. It is 20 markdown files and it is what the
# retrieval layer ingests on first boot.
COPY content ./content

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s \
  CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://localhost:8000/healthz').status==200 else 1)"

# Render assigns the port in $PORT; locally it is 8000.
CMD ["sh", "-c", "uvicorn companion.api.app:app --host 0.0.0.0 --port ${PORT:-8000}"]
