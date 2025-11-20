package main

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

func env(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func main() {
	rabbit := env("RABBIT_URL", "amqp://guest:guest@rabbitmq:5672/")
	queue := env("QUEUE_NAME", "weather.data")
	api := env("API_ENDPOINT", "http://nest-api:3000/api/weather/logs")

	conn, err := amqp.Dial(rabbit)
	if err != nil {
		log.Fatalf("dial: %v", err)
	}
	defer conn.Close()
	ch, _ := conn.Channel()
	defer ch.Close()
	ch.Qos(5, 0, false)
	msgs, _ := ch.Consume(queue, "worker", false, false, false, false, nil)
	client := &http.Client{Timeout: 10 * time.Second}
	for d := range msgs {
		log.Printf("recv msg size=%d", len(d.Body))
		// forward raw
		req, _ := http.NewRequest("POST", api, bytes.NewReader(d.Body))
		req.Header.Set("Content-Type", "application/json")
		resp, err := client.Do(req)
		if err != nil {
			log.Printf("post error: %v - nack/requeue", err)
			d.Nack(false, true)
			continue
		}
		io.ReadAll(resp.Body)
		resp.Body.Close()
		if resp.StatusCode >= 200 && resp.StatusCode < 300 {
			d.Ack(false)
			log.Printf("acked")
		} else {
			log.Printf("api returned %d - nack/requeue", resp.StatusCode)
			d.Nack(false, true)
		}
	}
}
