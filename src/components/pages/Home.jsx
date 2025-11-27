import React from "react";
import Card from "../Molecule/Card/Card";

const Home = () => {
  // studyData 위에 레벨로 props로 전달해야
  const studyData = [
    {
      studyname: "아유디의 UX 스터디",
      point: 310,
      day: 62,
      goal: "Slow And Steady Wins The Race!!",
      reactionData: reactionData(),
    },
  ];
  function reactionData() {
    return [
      { id: "dev", type: "reaction", emoji: "🧑‍💻", value: 37 },
      { id: "fire", type: "reaction", emoji: "🔥", value: 26 },
      { id: "heart", type: "reaction", emoji: "🤍", value: 14 },
    ];
  }
  return <div>{/* <Card data={studyData} /> */}</div>;
};

export default Home;
