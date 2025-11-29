import React, { useEffect, useState } from "react";
import "@styles/pages/habit.css";
import Chip from "@Atoms/chip/chip";

function Habit() {
    const [time, setTime] = useState("");
    const [habits, setHabits] = useState([]); // DB에서 가져온 습관 목록

    const formatDateTime = () => {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        let hour = now.getHours();
        const minute = String(now.getMinutes()).padStart(2, "0");
        const ampm = hour < 12 ? "오전" : "오후";

        if (hour === 0) {
            hour = 12;
        } else if (hour > 12) {
            hour = hour - 12;
        }

        return `${year}-${month}-${day} ${ampm} ${hour}:${minute}`;
    };

    const updateTime = () => setTime(formatDateTime());

    const getTodayColumn = () => {
        const days = ["SUN", "MON", "TUE", "WEN", "THU", "FRI", "SAT"];
        const today = new Date().getDay(); // 0~6 (0: 일요일)
        return days[today];
    };

    // const handleHabitClick = async (habitId) => {
    //     const todayColumn = getTodayColumn();

    //     try {
    //         await api.patch(`/habits/${habitId}`, {
    //             [todayColumn]: true,
    //         });

    //         setHabits((prev) =>
    //             prev.map((habit) =>
    //                 habit.id === habitId
    //                     ? { ...habit, [todayColumn]: true }
    //                     : habit
    //             )
    //         );
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    useEffect(() => {
        updateTime();
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    // useEffect(() => {
    //     fetchHabits();
    // }, []);

    return (
        <div className="habit-container">
            <div className="habit-content">
                <div className="habit-content-header">
                    <div className="habit-header-title">
                        <h2>연우의 개발공장</h2>
                    </div>
                    <div className="habit-content-button">
                        <button>오늘의 집중</button>
                        <button>오늘의 홈</button>
                    </div>
                </div>

                <div className="habit-time-title">
                    <p className="habit-now-time">현재 시간</p>
                    <div className="habit-time-box">
                        <p>{time}</p>
                    </div>
                </div>

                <div className="habit-today">
                    <div className="habit-box">
                        <h2>오늘의 습관</h2>

                        <div className="habit-chip-list">
                            {/* {habits.map((habit) => (
                                <Chip
                                    key={habit.id}
                                    onClick={() => handleHabitClick(habit.id)}
                                    variant={
                                        habit[getTodayColumn()]
                                            ? "active"
                                            : "default"
                                    }
                                >
                                    {habit.name}
                                </Chip>
                            ))} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Habit;
