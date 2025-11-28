import React from "react";
import Card from "../Molecule/Card/Card";
import { MOCK_STUDIES } from "../../mocks/studyCardMock";
import LoadMoreButton from "../Atoms/button/LoadMoreButton";

const Home = () => {
  return (
    <div>
      <Card size={"lg"} theme={"light"} studyData={MOCK_STUDIES} />
      <LoadMoreButton />
    </div>
  );
};

export default Home;
