import { useEffect, useState } from "react";
import { getToken } from "../services/auth";
import { formatWeekDate, formatTime } from "../services/dateUtil";
import { FullExam } from "../interfaces/FullExam";
import { getCourseEndTime } from "../services/dateUtil";
import { getAccommodationString } from "../services/textUtil";
import "./tailwind.css";
type Props = {
    date: string;
}

export default function DatedExamList({ date }: Props) {
    const [exams, setExams] = useState<FullExam[]>([]);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        const token = getToken();

        if (!token) {
            setError('Missing auth credentials');
            return;
        }
        fetch(`http://localhost:8080/api/exam/getbydate/${date}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch exams');
                return res.json();
            })
            .then((data: FullExam[]) => {
                setExams(data);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, [date]);


    const toggleOnline = (examID: string) => {
        const updatedExams = exams.map((exam) => {
            if (exam.exam.examid === examID) {
                return {
                    ...exam,
                    exam: {
                        ...exam.exam,
                        examonline: !exam.exam.examonline,
                    },
                };
            }
            return exam;
        });

        setExams(updatedExams);
    };

    const toggleComplete = (examID: string) => {
        const updatedExams = exams.map((exam) => {
            if (exam.exam.examid === examID) {
                return {
                    ...exam,
                    exam: {
                        ...exam.exam,
                        examcomplete: !exam.exam.examcomplete,
                    },
                };
            }
            return exam;
        });

        setExams(updatedExams);
    };

    const handleCompleteToggle = (examID: string, isComplete: boolean) => {
        if (isComplete) {
            const confirm = window.confirm("Are you sure you want to mark this exam as incomplete?");
            if (!confirm) return;
        } else {
            const confirm = window.confirm("Are you sure you want to mark this exam as complete?");
            if (!confirm) return;
        }

        const updatedExams = exams.map((exam) => {
            if (exam.exam.examid === examID) {
                return {
                    ...exam,
                    exam: {
                        ...exam.exam,
                        examcomplete: !exam.exam.examcomplete,
                    },
                };
            }
            return exam;
        });

        setExams(updatedExams);

    }


    return (
        <div className="flex justify-center">
            <div className="w-full max-w-7/8">
                <h2>Exams on {formatWeekDate(date)}:</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {exams.length === 0 ? (
                    <p>There are no exams today!</p>
                ) : (
                    <div className="relative overflow-x-auto relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-100 uppercase bg-gradient-to-l from-blue-400 to-indigo-500">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Student</th>
                                    <th scope="col" className="px-6 py-3">Course</th>
                                    <th scope="col" className="px-6 py-3">Start Time</th>
                                    <th scope="col" className="px-6 py-3">Location</th>
                                    <th scope="col" className="px-6 py-3">Class Days</th>
                                    <th scope="col" className="px-6 py-3">End Time</th>
                                    <th scope="col" className="px-6 py-3">Accommodations</th>
                                    <th scope="col" className="px-6 py-3">Online?</th>
                                    <th scope="col" className="px-6 py-3">Complete?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map((fullExam) => (
                                    <tr key={fullExam.exam.crn} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {fullExam.user.fullname}
                                        </th>
                                        <td className="px-6 py-4">{fullExam.course.courseid}</td>
                                        <td className="px-6 py-4">{formatTime(fullExam.exam.examtime)}</td>
                                        <td className="px-6 py-4">{fullExam.exam.examlocation}</td>
                                        <td className="px-6 py-4">{fullExam.course.meetdays}</td>
                                        <td className="px-6 py-4">{getCourseEndTime(fullExam.exam.examtime, fullExam.exam.examduration * fullExam.user.timeextension)}</td>
                                        <td className="px-6 py-4">{getAccommodationString(fullExam.user)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={fullExam.exam.examonline}
                                                onChange={() => toggleOnline(fullExam.exam.examid)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={fullExam.exam.examcomplete}
                                                onChange={() => handleCompleteToggle(fullExam.exam.examid, fullExam.exam.examcomplete)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                )}

            </div>
        </div>

    );
}
