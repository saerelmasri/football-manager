export type Player = {
  id: number;
  name: string;
  position: "Goalkeeper" | "Defender" | "Midfielder" | "Attacker";
  isStarting: boolean;
  transferListed?: boolean;
  askingPrice?: number;
};