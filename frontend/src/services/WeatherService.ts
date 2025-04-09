import { ref } from "vue";

// Define weather data interface
export interface WeatherData {
  icon: string;
  description: string;
  temperature: number;
}

export class WeatherService {
  private static API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "";

  public static async getDayWeather(
    lat: number,
    lng: number,
    date: string,
    isFirstDay: boolean
  ): Promise<WeatherData | null> {
    try {
      // Use current weather API for the first day of the event
      if (isFirstDay) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${this.API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        return {
          icon: data.weather[0]?.icon || "",
          description: data.weather[0]?.description || "",
          temperature: data.main?.temp || 0,
        };
      }

      // For other dates, use forecast API
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${this.API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.list || !Array.isArray(data.list)) {
        console.error("Invalid API response:", data);
        return null;
      }

      // Filter forecast for the requested date
      const requestedDate = new Date(date).toISOString().split("T")[0];
      const relevantForecasts = data.list.filter((item: any) => {
        const itemDate = new Date(item.dt * 1000).toISOString().split("T")[0];
        return itemDate === requestedDate;
      });

      if (relevantForecasts.length === 0) return null;

      // Use the middle of the day forecast (or first available)
      const forecast =
        relevantForecasts[Math.floor(relevantForecasts.length / 2)];

      return {
        icon: forecast.weather[0]?.icon || "",
        description: forecast.weather[0]?.description || "",
        temperature: forecast.main?.temp || 0,
      };
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      return null;
    }
  }

  // Utility function to get appropriate icon class based on OpenWeatherMap icon code
  public static getIconClass(iconCode: string): string {
    const iconMap: { [key: string]: string } = {
      "01d": "wi wi-day-sunny", // clear sky day
      "01n": "wi wi-night-clear", // clear sky night
      "02d": "wi wi-day-cloudy", // few clouds day
      "02n": "wi wi-night-alt-cloudy", // few clouds night
      "03d": "wi wi-cloud", // scattered clouds
      "03n": "wi wi-cloud",
      "04d": "wi wi-cloudy", // broken clouds
      "04n": "wi wi-cloudy",
      "09d": "wi wi-showers", // shower rain
      "09n": "wi wi-showers",
      "10d": "wi wi-day-rain", // rain
      "10n": "wi wi-night-alt-rain",
      "11d": "wi wi-thunderstorm", // thunderstorm
      "11n": "wi wi-thunderstorm",
      "13d": "wi wi-snow", // snow
      "13n": "wi wi-snow",
      "50d": "wi wi-fog", // mist
      "50n": "wi wi-fog",
      question: "wi wi-na",
    };

    return iconMap[iconCode] || "wi wi-na";
  }

  // Get weather-appropriate color class
  public static getWeatherColorClass(iconCode: string): string {
    const weatherType = iconCode.substring(0, 2);

    const colorMap: { [key: string]: string } = {
      "01": "text-yellow-500", // clear sky - sunny
      "02": "text-blue-300", // few clouds
      "03": "text-blue-400", // scattered clouds
      "04": "text-gray-500", // broken clouds
      "09": "text-blue-600", // shower rain
      "10": "text-blue-700", // rain
      "11": "text-purple-500", // thunderstorm
      "13": "text-blue-200", // snow
      "50": "text-gray-400", // mist
      qu: "text-gray-500", // question
    };

    return colorMap[weatherType] || "text-gray-500";
  }
}
