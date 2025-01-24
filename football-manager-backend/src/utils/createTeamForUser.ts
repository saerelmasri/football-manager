import { Player } from "../models/playerModel";
import { Team } from "../models/teamModel";

const FOOTBALL_PLAYERS = {
  GoalKeeper: [
    "Manuel Neuer",
    "Alisson Becker",
    "Ederson Moraes",
    "Jan Oblak",
    "Thibaut Courtois",
    "Hugo Lloris",
    "Marc-André ter Stegen",
    "Keylor Navas",
    "David de Gea",
    "Samir Handanović"
  ],
  Defender: [
    "Virgil van Dijk",
    "Sergio Ramos",
    "Kalidou Koulibaly",
    "Raphaël Varane",
    "Trent Alexander-Arnold",
    "Andrew Robertson",
    "Giorgio Chiellini",
    "Mats Hummels",
    "Aymeric Laporte",
    "Thiago Silva",
    "Jordi Alba",
    "Leonardo Bonucci",
    "Antonio Rüdiger",
    "Benjamin Pavard",
    "Marquinhos",
    "César Azpilicueta",
    "Luke Shaw",
    "Alphonso Davies",
    "Kyle Walker",
    "Kieran Trippier"
  ],
  Midfielder: [
    "Kevin De Bruyne",
    "Luka Modrić",
    "Toni Kroos",
    "N'Golo Kanté",
    "Frenkie de Jong",
    "Joshua Kimmich",
    "Bruno Fernandes",
    "Paul Pogba",
    "Thiago Alcântara",
    "Bernardo Silva",
    "Marco Verratti",
    "Jorginho",
    "Mason Mount",
    "Phil Foden",
    "Declan Rice",
    "Rodri",
    "Casemiro",
    "Federico Valverde",
    "Sergej Milinković-Savić",
    "Ilkay Gündogan"
  ],
  Attacker: [
    "Lionel Messi",
    "Cristiano Ronaldo",
    "Neymar Jr.",
    "Kylian Mbappé",
    "Robert Lewandowski",
    "Erling Haaland",
    "Harry Kane",
    "Karim Benzema",
    "Mohamed Salah",
    "Sadio Mané",
    "Romelu Lukaku",
    "Raheem Sterling",
    "Son Heung-min",
    "Paulo Dybala",
    "Antoine Griezmann",
    "Lautaro Martínez",
    "João Félix",
    "Gabriel Jesus",
    "Vinícius Júnior",
    "Philippe Coutinho"
  ]
};

export const createTeamForUser = async (userId: number) => {
  try {
    const team = await Team.create({
      userId: userId,
      budget: 5000000.0,
      name: `team-${userId}`
    });

    const players = [
      { type: "GoalKeeper", count: 3 },
      { type: "Defender", count: 6 },
      { type: "Midfielder", count: 6 },
      { type: "Attacker", count: 5 },
    ];

    for (const { type, count } of players) {
      //@ts-ignore
      const availablePlayers = FOOTBALL_PLAYERS[type];

      for (let i = 0; i < count; i++) {
        const playerName = availablePlayers[i % availablePlayers.length];

        await Player.create({
          teamId: team.id,
          name: playerName,
          position: type,
          transferListed: false
        });
      }
    }

    console.log(`Team and players created for userId ${userId}`);
  } catch (error) {
    console.log("Error creating team:", error);
    return;
  }
};
