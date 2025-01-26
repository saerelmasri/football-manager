/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import { formattedPrice } from "@/utils/common";
import {
  fetchTeamData,
  removePlayerFromMarket,
  setPlayerForSale,
  togglePlayerStarting,
} from "@/utils/apis/apiCalls";
import { Player } from "@/utils/types";

export default function TeamDisplay() {
  const [teamData, setTeamData] = useState<{
    name: string;
    budget: number;
    players: Player[];
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
        setTeamData(teamDataFromAPI.data.team);
      } catch (error) {
        alert(`Failed to fetch team data: ${error?.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [token]);

  console.log("Team:", teamData);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading team data...</p>
      </div>
    );
  }

  const handleToggleForSale = async (player: Player) => {
    if (player.transferListed) {
      // Remove from sale
      try {
        await removePlayerFromMarket(player.id, token as string);

        setTeamData((prevData) => {
          if (!prevData) return prevData;

          const updatedPlayers = prevData.players.map((p) =>
            p.id === player.id
              ? { ...p, transferListed: false, askingPrice: 0 }
              : p
          );

          return {
            ...prevData,
            team: { ...prevData, players: updatedPlayers },
          };
        });
        alert("Player removed from the market successfully.");
      } catch (error) {
        console.error("Error removing player from the market:", error);
        alert("Failed to remove player from the market.");
      }
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

          const updatedPlayers = prevData.players.map((player) =>
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
            team: { ...prevData, players: updatedPlayers },
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
        if (!prevData || !prevData.players) {
          console.error("teamData or players not available");
          return prevData;
        }

        const updatedPlayers = prevData.players.map((p) =>
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
            ...prevData,
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
    teamData?.players.filter(
      (player: { isStarting: boolean }) => player.isStarting
    ) || [];

  const benchPlayers =
    teamData?.players.filter(
      (player: { isStarting: boolean }) => !player.isStarting
    ) || [];

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 md:p-10">
      <Card className="w-full max-w-full">
        <CardHeader>
          <CardTitle>{teamData?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Transfer Budget: {formattedPrice(teamData?.budget as number)}
          </p>
          <div className="mb-8">
            <h3 className="font-bold mb-2">Starting Lineup</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {startingPlayers.map(
                (player: {
                  id: number;
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
                  id: number;
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
