/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PlayerCard from "@/components/PlayerCard";
import { fetchWithQueryParams, putWithBody } from "@/utils/apis/endpoints";
import { formattedPrice } from "@/utils/common";

export type Player = {
  id: number;
  name: string;
  position: "Goalkeeper" | "Defender" | "Midfielder" | "Attacker";
  isStarting: boolean;
  transferListed: boolean;
  askingPrice?: number;
};

export async function fetchTeamData(token: string) {
  try {
    const response = await fetchWithQueryParams("/team/", {}, token);
    return response;
  } catch (error) {
    console.error("Failed to fetch team data:", error);
    throw error;
  }
}

const setPlayerForSale = async (
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

export default function TeamDisplay() {
  const [teamData, setTeamData] = useState<{
    team: { name: string; budget: number; players: Player[] };
  } | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [askingPrice, setAskingPrice] = useState<string>("");
  const [lineupLoading, setLineupLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadTeamData = async () => {
      setLoading(true);
      try {
        const teamDataFromAPI = await fetchTeamData(token as string);
        setTeamData(teamDataFromAPI);
      } catch (error) {
        console.error("Failed to fetch team data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading team data...</p>
      </div>
    );
  }

  const handleToggleForSale = (player: Player) => {
    if (player.transferListed) {
      // Remove from sale
      setTeamData((prevData) => ({
        ...prevData!,
        players: prevData?.team.players.map((player) =>
          player.id === selectedPlayer?.id
            ? { ...player, transferListed: false, askingPrice: 0 }
            : player
        ),
      }));
    } else {
      // Set for sale
      setSelectedPlayer(player);
    }
  };

  const handleSetForSale = async () => {
    if (selectedPlayer && askingPrice && !isNaN(Number(askingPrice))) {
      try {
        await setPlayerForSale(
          selectedPlayer.id,
          Number(askingPrice),
          token as string
        );
        setTeamData((prevData) => {
          if (!prevData) return prevData;

          const updatedPlayers = prevData.team.players.map((player) =>
            player.id === selectedPlayer.id
              ? {
                  ...player,
                  transferListed: true,
                  askingPrice: Number(askingPrice),
                }
              : player
          );

          return {
            ...prevData,
            team: { ...prevData.team, players: updatedPlayers },
          };
        });

        setSelectedPlayer(null);
        setAskingPrice("");
      } catch (error) {
        console.error("Error while setting player for sale:", error);
        alert("Failed to set player for sale.");
      }
    } else {
      alert("Please enter a valid asking price.");
    }
  };

  const handleToggleLineup = async (player: Player, isStarting: boolean) => {
    setLineupLoading(true);

    try {
      await togglePlayerStarting(player.id, isStarting, token as string);

      setTeamData((prevData) => {
        if (!prevData || !prevData.team.players) {
          console.error("teamData or players not available");
          return prevData;
        }

        const updatedPlayers = prevData.team.players.map((p) =>
          p.id === player.id ? { ...p, isStarting } : p
        );

        const currentStartingLineUp = updatedPlayers.filter(
          (p) => p.isStarting
        ).length;
        if (!player.isStarting && isStarting && currentStartingLineUp > 11) {
          alert("Cannot add more than 11 players to the starting lineup.");
          return prevData;
        }

        return {
          ...prevData,
          team: {
            ...prevData.team,
            players: updatedPlayers,
          },
        };
      });
    } catch (error) {
      console.error("Error toggling lineup:", error);
      alert("Failed to update lineup.");
    } finally {
      setLineupLoading(false);
    }
  };

  const startingPlayers =
    teamData?.team.players.filter(
      (player: { isStarting: any }) => player.isStarting
    ) || [];

  const benchPlayers =
    teamData?.team.players.filter(
      (player: { isStarting: any }) => !player.isStarting
    ) || [];

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 md:p-10">
      <Card className="w-full max-w-full">
        <CardHeader>
          <CardTitle>{teamData?.team.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Transfer Budget: {formattedPrice(teamData?.team.budget as number)}
          </p>
          <div className="mb-8">
            <h3 className="font-bold mb-2">Starting Lineup</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {startingPlayers.map(
                (player: {
                  id: any;
                  name?: string;
                  position?:
                    | "Goalkeeper"
                    | "Defender"
                    | "Midfielder"
                    | "Attacker";
                  isStarting?: boolean;
                  transferListed?: boolean;
                  askingPrice?: number | undefined;
                }) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onToggleForSale={handleToggleForSale}
                    onToggleLineup={handleToggleLineup}
                    lineupLoading={lineupLoading} // Pass the lineup loading state to PlayerCard
                  />
                )
              )}
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2">Bench</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {benchPlayers.map(
                (player: {
                  id: any;
                  name?: string;
                  position?:
                    | "Goalkeeper"
                    | "Defender"
                    | "Midfielder"
                    | "Attacker";
                  isStarting?: boolean;
                  transferListed?: boolean;
                  askingPrice?: number | undefined;
                }) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onToggleForSale={handleToggleForSale}
                    onToggleLineup={handleToggleLineup}
                    lineupLoading={lineupLoading}
                  />
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8">
        <Link href="/transfer">
          <Button>Go to Transfer Market</Button>
        </Link>
      </div>

      <Dialog
        open={!!selectedPlayer}
        onOpenChange={() => setSelectedPlayer(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Set Asking Price for {selectedPlayer?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="asking-price" className="text-right">
                Asking Price
              </Label>
              <Input
                id="asking-price"
                type="number"
                value={askingPrice}
                onChange={(e) => setAskingPrice(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleSetForSale}>Set For Sale</Button>
        </DialogContent>
      </Dialog>
    </main>
  );
}
