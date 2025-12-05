import { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import BaseButton from "@atoms/button/BaseButton";
import "@styles/organism/ModalHabitList.css";
import {
    fetchTodayHabits,
    createHabit,
    deleteHabit,
    updateHabit,
} from "@api/service/habitservice";

import Chip from "@atoms/chip/Chip";
import DeleteButton from "../atoms/button/DeleteButton";

function ModalHabitList({ onClose, onSubmit }) {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const studyId = searchParams.get("id");
    const password = location.state?.password ?? "1234";

    const [habits, setHabits] = useState([]);
    const [selected, setSelected] = useState(new Set());

    const [showInput, setShowInput] = useState(false);
    const [newHabitName, setNewHabitName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    //  수정 기능 추가
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [editedHabits, setEditedHabits] = useState({});

    const loadHabits = async () => {
        try {
            const data = await fetchTodayHabits(studyId, password);

            const list = (data.habits ?? []).map((habit) => ({
                id: habit.HABIT_ID,
                name: habit.NAME,
                isDone: habit.isDone,
            }));

            setHabits(list);

            const preSelected = new Set(
                list.filter((h) => h.isDone).map((h) => h.id)
            );
            setSelected(preSelected);
        } catch (error) {
            console.error("오늘의 습관 조회 실패:", error);
        }
    };

    useEffect(() => {
        loadHabits();
    }, [studyId, password]);

    const toggleHabit = (habitId) => {
        setSelected((prev) => {
            const newSet = new Set(prev);
            newSet.has(habitId) ? newSet.delete(habitId) : newSet.add(habitId);
            return newSet;
        });
    };

    const handleSubmit = async () => {
        // 1. 수정된 습관이 하나도 없으면 → 서버 호출 없이 그냥 닫기
        const entries = Object.entries(editedHabits);
        if (entries.length === 0) {
            if (onSubmit) {
                await onSubmit(); // 부모에서 loadHabits 해주는 콜백
            }
            onClose();
            return;
        }

        try {
            // 2. 수정된 습관이 있을 때만 updateHabit 호출
            const promises = entries.map(([habitId, name]) =>
                updateHabit(studyId, habitId, { name })
            );

            await Promise.all(promises);

            // 3. 부모(Habit)에서 다시 오늘의 습관 조회
            if (onSubmit) {
                await onSubmit();
            }

            onClose();
        } catch (error) {
            console.error("습관 수정 전체 저장 실패:", error);
            // 필요하면 여기서 토스트 띄워도 됨
        }
    };

    const handleClickAddButton = () => {
        setShowInput(true);
    };

    const handleNewHabitKeyDown = async (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();

        if (isCreating) return;

        const trimmed = newHabitName.trim();
        if (!trimmed) return;

        try {
            setIsCreating(true);

            await createHabit(studyId, { name: trimmed });

            await loadHabits();
            setNewHabitName("");
            setShowInput(false);
        } catch (error) {
            console.error("새 습관 생성 실패:", error);
        } finally {
            setIsCreating(false);
        }
    };

    //  습관 삭제
    const handleDeleteHabit = async (habitId, e) => {
        e?.stopPropagation();
        try {
            await deleteHabit(studyId, habitId);
            await loadHabits();
        } catch (error) {
            console.error("습관 삭제 실패:", error);
        }
    };

    //  습관 수정
    const startEdit = (habit, e) => {
        e?.stopPropagation();
        setEditingId(habit.id);
        setEditValue(habit.name);
    };

    // 수정 값 입력
    const handleEditChange = (e) => {
        setEditValue(e.target.value);
    };

    // 수정 모드
    const handleEditKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submitEdit(); // 이제 여기서는 서버 안 감
        }
        if (e.key === "Escape") {
            cancelEdit();
        }
    };

    // 칩 수정 모드를 취소, 원래 상태로
    const cancelEdit = () => {
        setEditingId(null);
        setEditValue("");
    };
    // 수정값 보내기
    const submitEdit = () => {
        const trimmed = editValue.trim();
        if (!trimmed) {
            cancelEdit();
            return;
        }

        // 화면에 보이는 habits만 먼저 수정
        setHabits((prev) =>
            prev.map((h) => (h.id === editingId ? { ...h, name: trimmed } : h))
        );

        // 나중에 "수정완료"를 눌렀을 때 서버에 보낼 수정 목록 저장
        setEditedHabits((prev) => ({
            ...prev,
            [editingId]: trimmed,
        }));

        cancelEdit();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-habit-container">
                <div className="modal-habit-content">
                    <header className="modal-habit-header">
                        <h2>습관 목록</h2>
                    </header>

                    <div className="modal-body">
                        <div className="habit-item-list">
                            {/* 습관 항목 + delete 버튼 */}
                            {habits.map((habit) => (
                                <div
                                    key={habit.id}
                                    className="habit-item-wrapper-btn"
                                >
                                    {/*  수정일 때 input */}
                                    {editingId === habit.id ? (
                                        <input
                                            className="habit-input"
                                            value={editValue}
                                            autoFocus
                                            onChange={handleEditChange}
                                            onKeyDown={handleEditKeyDown}
                                            onBlur={cancelEdit}
                                        />
                                    ) : (
                                        <div
                                            className="habit-item "
                                            onClick={(e) => startEdit(habit, e)}
                                        >
                                            {habit.name}
                                        </div>
                                    )}
                                    {/* 삭제버튼 */}
                                    <DeleteButton
                                        onClick={(e) =>
                                            handleDeleteHabit(habit.id, e)
                                        }
                                    />
                                </div>
                            ))}

                            {/* 새 습관 입력 창 add버튼 누를 때만 나옴 */}
                            {showInput && (
                                <div className="habit-item-wrapper-btn">
                                    <input
                                        className="habit-input"
                                        value={newHabitName}
                                        onChange={(e) =>
                                            setNewHabitName(e.target.value)
                                        }
                                        onKeyDown={handleNewHabitKeyDown}
                                        placeholder="새 습관을 입력하고 Enter"
                                    />
                                    <DeleteButton />
                                </div>
                            )}
                        </div>
                        {/* 습관 add버튼 */}
                        <button
                            className="habit-add-btn"
                            type="button"
                            onClick={handleClickAddButton}
                        >
                            +
                        </button>
                    </div>
                    {/*  수정완료, 취소 버튼*/}
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
