/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

"use client";

import { useCallback, useEffect, useState } from "react";
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
import { fetchWithQueryParams, postWithBody } from "@/utils/apis/endpoints";
import { formattedPrice } from "@/utils/common";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Player } from "@/utils/types";

export default function TransferMarket() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [tempFilters, setTempFilters] = useState({
    teamName: "",
    playerName: "",
    position: "",
    minPrice: "",
    maxPrice: "",
  });
  const [filters, setFilters] = useState(tempFilters);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithQueryParams(
        "/transfer/filter-players",
        {
          playerName: filters.playerName || undefined,
          teamName: filters.teamName || undefined,
          position: filters.position || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
        },
        token as string
      );

      if (response.status === 200) {
        setPlayers(response.data.transfers);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (err) {
      console.error("Error fetching players:", err);
      setError("Failed to fetch players. Please try again later.");
      setTimeout(() => {
        setError(null);
        fetchPlayers();
      }, 2000);
    } finally {
      setLoading(false);
    }
  }, [filters, token]);

  useEffect(() => {
    if (token) {
      fetchPlayers();
    }
  }, [token, filters, fetchPlayers]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setFilters(tempFilters);
  };

  const handleBuyPlayer = async (playerId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await postWithBody(
        "/transfer/buy-player",
        { playerId: playerId },
        token as string
      );

      console.log("Response buy:", response);
      
      if (response.message) {
        setDialogMessage("Player purchased successfully!");
        setShowDialog(true);
        setFilters({ ...filters });
      } else {
        throw new Error("Error buying the player");
      }
    } catch (err) {
      alert(err.response.data.message);
      setError("Failed to complete purchase. Please try again.");
      setTimeout(() => {
        setError(null);
        fetchPlayers();
      }, 2000);
    } finally {
      setLoading(false);
    }
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
              name="teamName"
              value={tempFilters.teamName}
              onChange={handleFilterChange}
            />
            <Input
              placeholder="Filter by player"
              name="playerName"
              value={tempFilters.playerName}
              onChange={handleFilterChange}
            />
            <Input
              placeholder="Filter by position"
              name="position"
              value={tempFilters.position}
              onChange={handleFilterChange}
            />
            <Input
              placeholder="Min price"
              name="minPrice"
              type="number"
              value={tempFilters.minPrice}
              onChange={handleFilterChange}
            />
            <Input
              placeholder="Max price"
              name="maxPrice"
              type="number"
              value={tempFilters.maxPrice}
              onChange={handleFilterChange}
            />
            <Button onClick={handleSearch}>Search</Button>
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
                        onClick={() => handleBuyPlayer(player.Player.id)}
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
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>{dialogMessage}</p>
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
