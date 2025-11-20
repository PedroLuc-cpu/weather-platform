import api from "./api/config";

async function getWeatherByLimitsQuery(limits: string) {
  const { data } = await api.get(`/weather`, { params: { limits } });

  return data;
}

export { getWeatherByLimitsQuery };
