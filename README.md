# Math Association Backend Task

An Express API that uses weather data from the OpenWeather API and provides in the required format.

## Routes

- `GET /weather/current?city=London` → current weather  
- `GET /weather/forecast?city=London` → 5-day forecast (3-hour intervals)  
- `GET /weather/bestday?city=London&condition=clear sky` → first forecast matching condition  

## Usage

1. Clone the repo  
2. Run `npm install`  
3. Start server: `node server.js`
