import "../../../assets/styles/Sticker.css";

function Sticker({ type }) {
    const src = `/img/${type}.svg`;

    return (
        <div className="sticker">
            <img src={src} alt={type} />
        </div>
    );
}

export default Sticker;
