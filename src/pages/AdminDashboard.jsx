// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const departments = [
  "ALL", "CSE", "IT", "ECE", "EEE", "MECH", "AI-ML", "MECHATRONICS", "CSBS", "CIVIL"
];

const AdminDashboard = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [questions, setQuestions] = useState({});
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedDay, setSelectedDay] = useState('ALL');

  useEffect(() => {
    fetch('/data')
      .then(res => res.json())
      .then(setFeedbackData)
      .catch(console.error);

    fetch('/questions')
      .then(res => res.json())
      .then(setQuestions)
      .catch(console.error);
  }, []);

  const days = ["ALL", ...Array.from({ length: 15 }, (_, i) => `Day ${i + 1}`)];

  const filtered = feedbackData.filter(entry =>
    (selectedDept === 'ALL' || entry.dept === selectedDept) &&
    (selectedDay === 'ALL' || entry.day === selectedDay)
  );

  const submissionCounts = filtered.reduce((acc, entry) => {
    acc[entry.dept] = (acc[entry.dept] || 0) + 1;
    return acc;
  }, {});

  const grouped = {};
  filtered.forEach(entry => {
    const key = `${entry.dept}-${entry.day}-${entry.session.topic}-${entry.session.time}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(entry);
  });

  return (
    <div className="p-6 max-w-7xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold text-center text-orange-500 mb-6">
        First Year SIP - Feedback Portal
      </h1>

      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold">Feedback Questions</h2>
        <ol className="list-decimal ml-5 mt-2">
          {["Q1", "Q2", "Q3", "Q4"].map((q, idx) => (
            <li key={q}><strong>{q}:</strong> {questions[q]}</li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div>
          <label className="font-semibold mr-2">Filter by Department:</label>
          <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
            {departments.map(dept => <option key={dept}>{dept}</option>)}
          </select>
        </div>

        <div>
          <label className="font-semibold mr-2">Filter by Day:</label>
          <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
            {days.map(day => <option key={day}>{day}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-6 bg-yellow-100 p-4 rounded-lg">
        <h3 className="font-semibold">Total Submissions:</h3>
        {Object.entries(submissionCounts).length > 0 ? (
          <ul className="list-disc ml-6">
            {Object.entries(submissionCounts).map(([dept, count]) => (
              <li key={dept}><strong>{dept}</strong>: {count}</li>
            ))}
          </ul>
        ) : (
          <p>No submissions for selected filters.</p>
        )}
      </div>

      {Object.entries(grouped).length === 0 && (
        <p className="text-center text-gray-500 mt-10">No data available for the selected filters.</p>
      )}

      {Object.entries(grouped).map(([key, entries], index) => {
        const [dept, day, topic, time] = key.split("-");
        const pos = entries.filter(e =>
          (e.answers[1] || "").toLowerCase().match(/yes|somewhat|good|ok/)
        ).length;
        const neg = entries.length - pos;

        const data = {
          labels: ['Helpful', 'Not Helpful'],
          datasets: [{
            label: 'Feedback',
            data: [pos, neg],
            backgroundColor: ['#fcb045', '#fd1d1d']
          }]
        };

        const tableHeaders = entries[0].answers.map((_, i) => `Q${i + 1}`);

        return (
          <div key={key} className="mb-10 bg-white p-5 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-1">{dept} - {day}</h3>
            <h4 className="mb-4 text-gray-600">{topic} ({time})</h4>
            <Bar data={data} />
            <table className="w-full mt-5 border border-gray-300 text-center">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th>Name</th>
                  {tableHeaders.map((q, idx) => (
                    <th key={idx}>{q}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={idx} className="border-t">
                    <td>{entry.user}</td>
                    {entry.answers.map((ans, i) => (
                      <td key={i}>{ans}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default AdminDashboard;

