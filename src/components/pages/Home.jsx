import React from "react";
import Card from "../Molecule/Card/Card";
import { MOCK_STUDIES } from "../../mocks/studyCardMock";

const Home = () => {
  return (
    <div>
      <Card size={"lg"} theme={"light"} studyData={MOCK_STUDIES} />
    </div>
  );
};

export default Home;
