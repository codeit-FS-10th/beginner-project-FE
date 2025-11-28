import { Link } from "react-router-dom";
import NavButton from "../../components/Atoms/button/NavButton";

function Detail() {
  return (
    <div>
      <NavButton to={"/habit"}>오늘의 습관</NavButton>
      <NavButton to={"/focus"}>오늘의 집중</NavButton>
    </div>
  );
}

export default Detail;
