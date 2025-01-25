/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchWithQueryParams } from "@/utils/apis/endpoints";
import { formattedPrice } from "@/utils/common";

type Player = {
  id: number;
  name: string;
  team: string;
  position: string;
  askingPrice: number;
};

export default function TransferMarket() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [filters, setFilters] = useState({
    team: "",
    player: "",
    maxPrice: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchWithQueryParams(
          "/transfer",
          {},
          token as string
        );

        console.log("response:", response);

        if (response?.message === "Transfer list retrieved successfully") {
          if (response.transfers && response.transfers.length > 0) {
            setPlayers(response.transfers);
          } else {
            console.warn("No players available in the transfer market.");
            setPlayers([]); // Ensure it's an empty array if no players are available
          }
        } else {
          throw new Error("Unexpected response status");
        }
      } catch (err: any) {
        console.error("Error fetching players:", err);
        setError("Failed to fetch players. Please try again later.");

        if (err.response?.status === 401) {
          alert("Your session has expired. Please log in again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPlayers();
    }
  }, [token]);

  

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredPlayers = players?.filter((player) => {
    // Safely checking if the properties exist before calling toLowerCase
    return (
      (player.team && player.team.toLowerCase().includes(filters.team.toLowerCase())) &&
      (player.name && player.name.toLowerCase().includes(filters.player.toLowerCase())) &&
      (filters.maxPrice === "" || player.askingPrice <= Number.parseInt(filters.maxPrice))
    );
  });
  
  console.log("Players:", filteredPlayers);


  // Placeholder for buy functionality
  const handleBuyPlayer = (playerId: number) => {
    console.log("Buying player with ID:", playerId);
    // Implement your buy functionality here (API call, etc.)
  };

  return (
    <main className="flex w-full min-h-screen flex-col items-center justify-center p-4 md:p-5">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Transfer Market</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <Input
              placeholder="Filter by team"
              name="team"
              value={filters.team}
              onChange={handleFilterChange}
            />
            <Input
              placeholder="Filter by player"
              name="player"
              value={filters.player}
              onChange={handleFilterChange}
            />
            <Input
              placeholder="Max price"
              name="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>
          {loading ? (
            <p>Loading players...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : players?.length === 0 ? (
            <p className="text-center">Marketplace is empty right now</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players?.map((player) => (
                  <TableRow key={player.Player.id}>
                    <TableCell>{player.Player.name}</TableCell>
                    <TableCell>{player.Player.Team.name}</TableCell>
                    <TableCell>{player.Player.position}</TableCell>
                    <TableCell>{formattedPrice(player.askingPrice)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBuyPlayer(player.id)}
                      >
                        Buy
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <div className="mt-8">
        <Link href="/team">
          <Button>Back to Team</Button>
        </Link>
      </div>
    </main>
  );
}
