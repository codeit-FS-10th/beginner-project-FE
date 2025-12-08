import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BaseButton from "@atoms/button/BaseButton";
import { getToken } from "@utils/tokenStorage";
import "@styles/organism/ModalHabitList.css";
import {
    fetchTodayHabits,
    createHabit,
    deleteHabit,
    updateHabit,
} from "@api/service/habitservice";

import DeleteButton from "../atoms/button/DeleteButton";

function ModalHabitList({ onClose, onSubmit }) {
    // 1. 라우터 훅
    const [searchParams] = useSearchParams();
    const studyId = searchParams.get("id");
    const token = getToken(studyId) || "";

    // 2. state 선언
    const [habits, setHabits] = useState([]);

    const [showInput, setShowInput] = useState(false);
    const [newHabitName, setNewHabitName] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [editedHabits, setEditedHabits] = useState({});

    const [deletedIds, setDeletedIds] = useState(new Set());

    // 3. 오늘의 습관 로딩 함수
    const loadHabits = async () => {
        try {
            const data = await fetchTodayHabits(studyId, token);

            const list = (data.habits ?? []).map((habit) => ({
                id: habit.HABIT_ID,
                name: habit.NAME,
                isDone: habit.isDone,
                isNew: false,
            }));

            setHabits(list);
        } catch (error) {
            console.error("오늘의 습관 조회 실패:", error);
        }
    };

    // 4. 마운트 & studyId/token 변경 시 로딩
    useEffect(() => {
        if (studyId && token) {
            loadHabits();
        }
    }, [studyId, token]);

    // 5. 수정완료(저장) 핸들러
    const handleSubmit = async () => {
        const entries = Object.entries(editedHabits); // { id: name } → [ [id, name], ... ]
        const deleted = Array.from(deletedIds); // Set → 배열
        const newHabits = habits.filter((h) => h.isNew); // 새로 만든 습관들

        // 변경이 하나도 없으면 그냥 닫기
        if (
            entries.length === 0 &&
            deleted.length === 0 &&
            newHabits.length === 0
        ) {
            onClose();
            return;
        }

        try {
            // isNew 가 아닌 것만 PATCH 대상으로 필터링
            const updatePromises = entries
                .filter(([habitId]) => {
                    const target = habits.find(
                        (h) => String(h.id) === String(habitId)
                    );
                    return target && !target.isNew;
                })
                .map(([habitId, name]) =>
                    updateHabit(studyId, habitId, { name })
                );

            const deletePromises = deleted.map((habitId) =>
                deleteHabit(studyId, habitId)
            );

            const createPromises = newHabits.map((h) =>
                createHabit(studyId, { name: h.name })
            );

            await Promise.all([
                ...updatePromises,
                ...deletePromises,
                ...createPromises,
            ]);

            if (onSubmit) {
                await onSubmit();
            }
        } catch (error) {
            console.error("습관 수정 전체 저장 실패:", error);
        } finally {
            onClose();
        }
    };

    // 6. 추가/삭제 핸들러
    const handleClickAddButton = () => {
        setShowInput(true);
    };

    const handleNewHabitKeyDown = (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();

        const trimmed = newHabitName.trim();
        if (!trimmed) return;

        setHabits((prev) => [
            ...prev,
            {
                id: `temp-${Date.now()}`, // 임시 ID (서버에 없는 값)
                name: trimmed,
                isDone: false,
                isNew: true,
            },
        ]);

        setNewHabitName("");
        setShowInput(false);
    };

    // 습관 삭제
    const handleDeleteHabit = (habit, e) => {
        e?.stopPropagation();

        // 화면에서만 삭제
        setHabits((prev) => prev.filter((h) => h.id !== habit.id));

        // 서버에 이미 있던 습관만 삭제 예약 목록에 추가
        if (!habit.isNew) {
            setDeletedIds((prev) => {
                const next = new Set(prev);
                next.add(habit.id);
                return next;
            });
        }
    };

    // 7. 수정 관련 핸들러
    const startEdit = (habit, e) => {
        e?.stopPropagation();
        setEditingId(habit.id);
        setEditValue(habit.name);
    };

    const handleEditChange = (e) => {
        setEditValue(e.target.value);
    };

    const handleEditKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submitEdit();
        }
        if (e.key === "Escape") {
            cancelEdit();
        }
    };

    // 수정 취소
    const cancelEdit = () => {
        setEditingId(null);
        setEditValue("");
    };

    // 수정값 확정 (state만 변경, API X)
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

        // 나중에 수정완료 버튼 눌렀을 때 서버에 보낼 수정 목록 저장
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
                                            handleDeleteHabit(habit, e)
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
                    </div>
                    {/* 습관 add버튼 */}
                    <button
                        className="habit-add-btn"
                        type="button"
                        onClick={handleClickAddButton}
                    >
                        +
                    </button>
                    {/*  수정완료, 취소 버튼*/}
                    <footer className="modal-habit-footer">
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
