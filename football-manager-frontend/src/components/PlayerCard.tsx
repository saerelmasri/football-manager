import { Player } from "@/app/team/page";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

import goalkeeperImage from "../../public/goalkeeper.png";
import playerImage from "../../public/player.png";

type PlayerCardProps = {
  player: Player;
  onToggleForSale: (player: Player) => void;
  onToggleLineup: (player: Player, isStarting: boolean) => void;
  lineupLoading: boolean;
};

export default function PlayerCard({
  player,
  onToggleForSale,
  onToggleLineup,
  lineupLoading,
}: PlayerCardProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleToggleLineup = async () => {    
    setLoading(true);
    try {
      // Toggle lineup status
      await onToggleLineup(player, !player.isStarting);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error toggling lineup:", error);
      alert("Error updating lineup.");
    }
  };

  return (
    <div className="bg-gray-100 p-2 rounded-md flex flex-col items-center justify-center text-center space-y-3">
      <Image
        src={
          player.position.toLowerCase() === "goalkeeper"
            ? goalkeeperImage
            : playerImage
        }
        alt={player.position}
        width={56}
        height={56}
        className="rounded-full mb-2"
      />
      <span className="text-sm font-medium">{player.name}</span>
      <span className="text-xs text-gray-500">{player.position}</span>
      <div className="space-x-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleLineup}
          disabled={lineupLoading || loading} // Disable the button if any loading is happening
        >
          {lineupLoading || loading
            ? "Updating..."
            : player.isStarting
            ? "Remove from Lineup"
            : "Add to Lineup"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => onToggleForSale(player)} 
          disabled={lineupLoading || loading}
        >
          {player.transferListed ? "Remove from Sale" : "Set for Sale"}
        </Button>
      </div>

      {player.transferListed && (
        <span className="text-xs text-green-600 mt-1">
          Player in market
        </span>
      )}
    </div>
  );
}
