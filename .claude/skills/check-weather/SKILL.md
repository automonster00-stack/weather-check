---
name: check-weather
description: Check current weather conditions and forecasts for any location. Use when the user asks about weather, temperature, forecast, rain, snow, humidity, or climate conditions for a city or region.
allowed-tools: WebSearch, WebFetch
---

# Check Weather

This skill retrieves current weather information from the internet for any location.

## Instructions

When the user asks about weather:

1. **Identify the location** - Extract the city, region, or country from the user's request
   - If no location specified, ask the user which location they want weather for

2. **Search for weather data** - Use WebSearch to find current weather:
   ```
   Search query: "weather [location] today current conditions"
   ```

3. **Extract and present key information**:
   - Current temperature (include both Celsius and Fahrenheit)
   - Weather condition (sunny, cloudy, rainy, etc.)
   - Humidity percentage
   - Wind speed and direction
   - High/Low temperatures for the day
   - Precipitation chance if available

4. **Format the response** clearly:
   ```
   Weather for [Location]:

   Current: [temp]°C ([temp]°F) - [condition]
   Feels like: [temp]°C
   Humidity: [%]
   Wind: [speed] [direction]
   Today's High/Low: [high]°C / [low]°C
   ```

5. **Include forecast** if the user asks for it or if it seems relevant

## Example Queries

- "What's the weather in Tokyo?"
- "Is it going to rain in London tomorrow?"
- "Current temperature in New York"
- "Weather forecast for Paris this week"

## Notes

- Always cite the source of weather data
- If weather data seems outdated, mention when it was last updated
- For ambiguous location names, clarify which location (e.g., "Paris, France" vs "Paris, Texas")
