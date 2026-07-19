import os, time, json, logging
import pika
import requests

logging.basicConfig(level=logging.INFO)

RABBIT_URL = os.getenv("RABBIT_URL", "amqp://guest:guest@rabbitmq:5672/")
QUEUE = os.getenv("QUEUE_NAME", "weather.data")
INTERVAL = int(os.getenv("INTERVAL_SEC", "3600"))


def get_locations():
    locations_env = os.getenv("LOCATIONS")
    if locations_env:
        try:
            locs = json.loads(locations_env)
            if isinstance(locs, list) and locs:
                return locs
        except Exception:
            logging.warning("LOCATIONS env inválido, usando LATITUDE/LONGITUDE")
    return [
        {
            "lat": float(os.getenv("LATITUDE", "-23.5489")),
            "lon": float(os.getenv("LONGITUDE", "-46.6388")),
            "name": os.getenv("LOCATION_NAME", "São Paulo"),
        }
    ]


def fetch_open_meteo(lat, lon):
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&current_weather=true"
        f"&hourly=rain,relativehumidity_2m"
        f"&timezone=auto"
    )
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    return r.json()


def connect_rabbitmq():
    params = pika.URLParameters(RABBIT_URL)
    while True:
        try:
            conn = pika.BlockingConnection(params)
            ch = conn.channel()
            ch.queue_declare(queue=QUEUE, durable=True)
            logging.info("Conectado ao RabbitMQ")
            return conn, ch
        except Exception as e:
            logging.error("Erro ao conectar ao RabbitMQ, tentando novamente: %s", e)
            time.sleep(5)


def publish(ch, data, location):
    payload = {
        "source": "open-meteo",
        "fetched_at": data.get("current_weather", {}).get("time"),
        "latitude": data.get("latitude"),
        "longitude": data.get("longitude"),
        "location_name": location.get("name"),
        "current": data.get("current_weather"),
        "raw": data,
    }
    ch.basic_publish(
        exchange="",
        routing_key=QUEUE,
        body=json.dumps(payload).encode("utf-8"),
        properties=pika.BasicProperties(
            content_type="application/json", delivery_mode=2
        ),
    )
    logging.info(
        "Publicado: local=%s time=%s temp=%s°C",
        location.get("name"),
        payload["fetched_at"],
        payload.get("current", {}).get("temperature"),
    )


def main():
    locations = get_locations()
    logging.info(
        "Monitorando %d local(is): %s",
        len(locations),
        [l.get("name") for l in locations],
    )
    conn, ch = connect_rabbitmq()

    while True:
        for loc in locations:
            try:
                data = fetch_open_meteo(loc["lat"], loc["lon"])
                publish(ch, data, loc)
            except pika.exceptions.AMQPError:
                logging.warning("Erro AMQP, reconectando...")
                conn, ch = connect_rabbitmq()
            except Exception as e:
                logging.exception("Erro para local %s: %s", loc.get("name"), e)
        time.sleep(INTERVAL)


if __name__ == "__main__":
    main()
