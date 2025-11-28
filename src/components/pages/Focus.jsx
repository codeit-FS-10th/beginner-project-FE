import { MOCK_STUDIES } from "../../mocks/studyCardMock";
import NavButton from "../../components/Atoms/button/NavButton";
import Tag from "../../components/Atoms/tag/Tag";
import TimerButton from "../../components/Atoms/button/TimerButton";
import "../../assets/styles/focus.css";

function Focus() {
  return (
    <div className="Container">
      {/* header */}
      <div className="Container-header">
        <div className="Container-title-box">
          <h1>연우의 개발공장</h1>
          <div className="nav-links">
            <NavButton>오늘의 습관</NavButton>
            <NavButton>홈</NavButton>
          </div>
        </div>
        <p className="Container-subheading">현재까지 획득한 포인트</p>
        <Tag type={"point"} theme={"light"} value={310} />
      </div>
      {/* content */}
      <div className="content-box">
        <h2>오늘의 집중</h2>
        <p className="time">25:00</p>
        <TimerButton size={"lg"} />
      </div>
    </div>
  );
}

export default Focus;
