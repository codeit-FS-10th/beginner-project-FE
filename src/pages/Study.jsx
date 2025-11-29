import "@styles/study.css";

function Study() {
    return (
        <div className="study-main-container">
            <section className="study-section">
                <h2>스터디 만들기</h2>
                <p>닉네임</p>
                <input type="text" placeholder="sad" />
                <p>스터디 이름</p>
                <input type="text" placeholder="sad" />
                <p>소개</p>
                <input type="text" placeholder="sad" />
                <p>배경을 선택해주세요</p>
            </section>
        </div>
    );
}

export default Study;
