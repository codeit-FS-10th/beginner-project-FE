import activeImg from "@img/sticker_active.svg";
import defaultImg from "@img/sticker_default.svg";

function Sticker({ active }) {
    const src = active ? activeImg : defaultImg;

    return (
        <div className="sticker">
            <img src={src} alt={"스티커"} />
        </div>
    );
}

export default Sticker;
