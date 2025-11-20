import os, time, json, logging
import pika
import requests

logging.basicConfig(level=logging.INFO)
RABBIT_URL = os.getenv("RABBIT_URL", "amqp://guest:guest@rabbitmq:5672/")
QUEUE = os.getenv("QUEUE_NAME", "weather.data")
LAT = float(os.getenv("LATITUDE", "0"))
LON = float(os.getenv("LONGITUDE", "0"))
INTERVAL = int(os.getenv("INTERVAL_SEC", "3600"))

def fetch_open_meteo(lat, lon):
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&hourly=rain,relativehumidity_2m&timezone=auto"
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    return r.json()

def main():
    params = pika.URLParameters(RABBIT_URL)
    while True:
        try:
            conn = pika.BlockingConnection(params)
            ch = conn.channel()
            ch.queue_declare(queue=QUEUE, durable=True)
            logging.info("Connected to RabbitMQ")
            break
        except Exception as e:
            logging.error("RabbitMQ connect error, retrying: %s", e)
            time.sleep(5)

    while True:
        try:
            data = fetch_open_meteo(LAT, LON)
            payload = {
                "source": "open-meteo",
                "fetched_at": data.get("current_weather", {}).get("time"),
                "latitude": data.get("latitude"),
                "longitude": data.get("longitude"),
                "current": data.get("current_weather"),
                "raw": data
            }
            body = json.dumps(payload).encode("utf-8")
            ch.basic_publish(
                exchange="",
                routing_key=QUEUE,
                body=body,
                properties=pika.BasicProperties(content_type='application/json', delivery_mode=2)
            )
            logging.info("Published weather payload time=%s", payload["fetched_at"])
        except Exception as e:
            logging.exception("Error fetching/publishing: %s", e)
        time.sleep(INTERVAL)

if __name__ == "__main__":
    main()
