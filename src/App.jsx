import BaseButton from "./components/Atoms/button/BaseButton";
import "./App.css";
// import PlayIcon from "./components/Atoms/Icons/PlayIcon";

import TimerButton from "./components/Atoms/button/TimerButton";
import Chip from "./components/Atoms/Chip/Chip";
import Tag from "./components/Atoms/tag/Tag";

function App() {
  const reactionData = [
    { id: "dev", emoji: "🧑‍💻", value: 37 },
    { id: "fire", emoji: "🔥", value: 26 },
    { id: "heart", emoji: "🤍", value: 14 },
    { id: "eyes", emoji: "👀", value: 12 },
    { id: "thumb", emoji: "👍", value: 11 },
    { id: "lol", emoji: "🤣", value: 9 },
  ];
  return (
    <div>
      {/* ***********. BaseButton   ************ */}
      <BaseButton size={"xl"}>스터디 만들기</BaseButton>
      <BaseButton type={"cancel"} size={"md"}>
        취소
      </BaseButton>

      {/* ***********. TimerButton   ************ */}

      <TimerButton variant={"start"} status={"inactive"} size={"lg"} />
      <TimerButton variant={"stop"} status={"active"} size={"sm"} />
      <TimerButton variant={"restart"} status={"inactive"} size={"lg"} />
      <TimerButton variant={"pause"} status={"active"} size={"sm"} />
      {/* ***********. chip   ************ */}
      <Chip>미라클모니 6시 기상</Chip>
      <Chip variant={"active"}>미라클모니 6시 기상</Chip>

      {/* ***********. Tag   ************ */}
      <Tag type={"point"} value={1300} size={"lg"} theme={"light"} />

      {reactionData.map((item) => (
        <Tag
          key={item.id}
          type={"reaction"}
          value={item.value}
          emoji={item.emoji}
          size={"sm"}
          theme={"dark"}
        />
      ))}
    </div>
  );
}

export default App;
