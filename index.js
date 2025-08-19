const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

app.get("/weather/current", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "City parameter is required" });
  }

  try {
    const weatherResponse = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        q: city,
        units: "metric",
        appid: API_KEY,
      },
    });

    const data = weatherResponse.data;

    res.json({
      city: data.name,
      temperature: data.main.temp,
      condition: data.weather[0].description,
      wind_speed: data.wind.speed,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/weather/forecast", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "City parameter is required" });
  }

  try {
    const forecastResponse = await axios.get("https://api.openweathermap.org/data/2.5/forecast", {
      params: {
        q: city,
        units: "metric",
        appid: API_KEY,
      },
    });

    const forecastData = forecastResponse.data.list.map((entry) => ({
      datetime: entry.dt_txt,
      temperature: entry.main.temp,
      condition: entry.weather[0].description,
      wind_speed: entry.wind.speed,
    }));

    res.json({
      city: forecastResponse.data.city.name,
      forecast: forecastData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/weather/bestday", async (req, res) => {
  const city = req.query.city;
  const condition = req.query.condition;

  if (!city || !condition) {
    return res.status(400).json({ error: "City and condition parameters are required" });
  }

  try {
    const forecastResponse = await axios.get("https://api.openweathermap.org/data/2.5/forecast", {
      params: {
        q: city,
        units: "metric",
        appid: API_KEY,
      },
    });

    const forecastData = forecastResponse.data.list;

    const match = forecastData.find((entry) =>
      entry.weather[0].description.toLowerCase().includes(condition.toLowerCase())
    );

    if (!match) {
      return res.status(404).json({ error: "No matching day found in the next 5 days" });
    }

    res.json({
      city: forecastResponse.data.city.name,
      temperature: match.main.temp,
      condition: match.weather[0].description,
      wind_speed: match.wind.speed,
      datetime: match.dt_txt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
