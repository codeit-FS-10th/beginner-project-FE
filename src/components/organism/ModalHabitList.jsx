import { useEffect, useState } from "react";
import BaseButton from "@atoms/button/BaseButton";
import "@styles/organism/ModalHabitList.css";
import { fetchTodayHabits } from "@api/service/habitservice";
import Chip from "@atoms/chip/Chip";
import DeleteButton from "../atoms/button/DeleteButton";

function ModalHabitList({ studyId, onClose, onSubmit }) {
    const [habits, setHabits] = useState([]);
    const [selected, setSelected] = useState(new Set());

    useEffect(() => {
        if (!studyId) return;

        async function loadData() {
            try {
                const res = await fetchTodayHabits(studyId);

                const list = Array.isArray(res) ? res : res?.habits ?? [];

                setHabits(list);

                const preSelected = new Set(
                    list
                        .filter((habit) => habit.isDone)
                        .map((habit) => habit.HABIT_ID)
                );
                setSelected(preSelected);
            } catch (err) {
                console.error("습관 불러오기 실패:", err);
            }
        }

        loadData();
    }, [studyId]);

    const toggleHabit = (habitId) => {
        setSelected((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(habitId)) {
                newSet.delete(habitId);
            } else {
                newSet.add(habitId);
            }
            return newSet;
        });
    };

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(Array.from(selected));
        }
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-habit-container">
                <div className="modal-content">
                    <header className="modal-header">
                        <h2>습관 목록</h2>
                    </header>

                    <div className="modal-body">
                        {habits.length === 0 ? (
                            <p className="empty-text">오늘 습관이 없어요.</p>
                        ) : (
                            <div className="chip-list">
                                {habits.map((habit) => (
                                    // <button
                                    //     key={habit.HABIT_ID}
                                    //     className="chip-wrapper-btn"
                                    //     onClick={() =>
                                    //         toggleHabit(habit.HABIT_ID)
                                    //     }
                                    // >
                                    <div>
                                        <Chip
                                            variant={
                                                selected.has(habit.HABIT_ID)
                                                    ? "active"
                                                    : "default"
                                            }
                                        >
                                            {habit.NAME}
                                        </Chip>
                                        <div>
                                            <DeleteButton />
                                        </div>
                                    </div>

                                    // </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <footer className="modal-footer">
                        <BaseButton type="cancle" size="xl" onClick={onClose}>
                            취소
                        </BaseButton>

                        <BaseButton
                            type="default"
                            size="xl"
                            onClick={handleSubmit}
                        >
                            수정완료
                        </BaseButton>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default ModalHabitList;
