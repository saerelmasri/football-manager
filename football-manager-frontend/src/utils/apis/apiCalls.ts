import { fetchWithQueryParams, putWithBody } from "./endpoints";

export async function fetchTeamData(token: string) {
  try {
    const response = await fetchWithQueryParams("/team/", {}, token);
    return response;
  } catch (error) {
    console.error("Failed to fetch team data:", error);
    throw error;
  }
}

export const setPlayerForSale = async (
  playerId: number,
  askingPrice: number,
  token: string
) => {
  try {
    const response = await putWithBody(
      "team/set-player-transfer",
      { playerId, askingPrice },
      token
    );
    console.log("API response:", response); // Log the response to debug
    return response;
  } catch (error) {
    console.error("Failed to set player for sale:", error);
    throw error;
  }
};

export async function togglePlayerStarting(
  playerId: number,
  isStarting: boolean,
  token: string
) {
  try {
    const response = await putWithBody(
      "team/set-player-lineup",
      { playerId, isStarting },
      token
    );
    return response;
  } catch (error) {
    console.error("Failed to toggle player starting status:", error);
    throw error;
  }
}

export const removePlayerFromMarket = async (
  playerId: number,
  token: string
) => {
  try {
    const response = await putWithBody(
      "team/remove-player-market",
      { playerId },
      token
    );
    return response;
  } catch (error) {
    console.error("Failed to remove player from market:", error);
    throw error;
  }
};
