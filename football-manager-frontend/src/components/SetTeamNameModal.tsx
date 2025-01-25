import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type SetTeamNameModalProps = {
  isOpen: boolean;
  onClose: (teamName: string) => void;
};

export default function SetTeamNameModal({
  isOpen,
  onClose,
}: SetTeamNameModalProps) {
  const [teamName, setTeamName] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim()) {
      onClose(teamName.trim()); // Submit team name
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Your Team Name</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grip gap-4 py-4">
            <div className="grip grid-cols-4 items-center gap-4">
              <label htmlFor="team-name" className="text-right">
                Team Name
              </label>
              <Input
                id="team-name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="col-span-3"
                placeholder="Enter your team name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Update Team Name</Button> {/* Updated text */}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
