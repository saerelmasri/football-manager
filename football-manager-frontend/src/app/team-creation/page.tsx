"use client";

import SetTeamNameModal from "@/components/SetTeamNameModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { putWithBody } from "@/utils/apis/endpoints";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function TeamCreation() {
  const [progress, setProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showNameModal, setShowNameModal] = useState<boolean>(false);

  const router = useRouter();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setIsLoading(false);
          setShowNameModal(true);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleSetTeamName = async (teamName: string) => {
    console.log(`Team name set to: ${teamName}`)

    try {
      console.log("Sending API request to update team name...");

      const response = await putWithBody("/team/update-name", {
        teamName: teamName,
      }, token as string);

      console.log("response:", response);
      

      if (response?.status === 200) {
        setShowNameModal(false);
        router.push("/team");
      } else {
        return new Error("Failed to update team name.");
      }
    } catch (error) {
      console.error("Error updating team name:", error);
      alert("There was an issue updating the team name. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {isLoading ? (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Creating Your Team</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="w-full" />
            <p className="mt-2 text-center">{progress.toFixed(0)}% Complete</p>
          </CardContent>
        </Card>
      ) : (
        <SetTeamNameModal isOpen={showNameModal} onClose={handleSetTeamName} />
      )}
    </main>
  );
}
