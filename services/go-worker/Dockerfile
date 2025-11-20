FROM golang:1.25.1 AS build
WORKDIR /app
COPY . .
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -o /worker .

FROM gcr.io/distroless/static
COPY --from=build /worker /worker
ENTRYPOINT ["/worker"]
