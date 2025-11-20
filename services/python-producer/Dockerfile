FROM python:3.11-slim
WORKDIR /app
COPY producer.py requirements.txt ./
RUN pip install -r requirements.txt
CMD ["python", "producer.py"]