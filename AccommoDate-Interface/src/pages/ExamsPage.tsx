import NavigationBar from "../components/NavigationBar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserRole } from "../services/auth";
import { formatDate } from "../services/dateUtil";
import StudentExamList from "../components/StudentExamList";
import DatedExamList from "../components/DatedExamList";
import "./tailwind.css"

export default function ExamsPage() {
    const navigate = useNavigate();


    const [role, setRole] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(() => {
        return formatDate(new Date());
    });

    useEffect(() => {
        const userRole = getUserRole();
        setRole(userRole)
    }, []);

    return (
        <div className="w-screen">
            <NavigationBar/>
            <h1 className="w-full max-w-7/8">Browse Exams</h1>
            
            {role === "ROLE_ADMIN" ? (
                <>
                    <label className="w-full max-w-7/8" htmlFor="exam-date">Choose a date: </label>
                    <input
                        type = "date"
                        id = "exam-date"
                        value = {selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <DatedExamList date = {selectedDate} />
                </>
            ) : (
                <StudentExamList/>
            )}
        </div>
    )
}