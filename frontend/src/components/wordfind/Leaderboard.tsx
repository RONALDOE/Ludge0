import React from "react";

type ILeaderboard = {
  team: string;
  points: string;
};
type LeaderboardProps = {
  leaderboard: ILeaderboard[];
};
const Leaderboard = (props: LeaderboardProps) => {
  return (
    <div className="p-10 overflow-auto max-h-96 ">
      <p className="font-bold text-2xl flex justify-center text-blue-500">
        Puntajes
      </p>
      <div className="flex justify-around ">
        {/* TODO: luca arrgela esto para que sea una tabla de 2x2 sin hacer 2 four loop porfavor */}
        {props.leaderboard.map((leaderboard, i) => (
          <div key={i} className="flex justify-between">
            <p className="text-md">{leaderboard.team}</p>
            <p className="text-md">{leaderboard.points}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
{
  /* <ol className="list-decimal">
{props.leaderboard.map((leaderboard, i) => (
  <li key={i} className="text-md">
    {leaderboard.team}
  </li>
))}
</ol>
<ul className="list-none">
{props.leaderboard.map((leaderboard, i) => (
  <li key={i} className="font-extrabold text-md text-blue-500">
    {leaderboard.points}
  </li>
))}
</ul> */
}
