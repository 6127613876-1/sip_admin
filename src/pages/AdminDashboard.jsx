// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Pie } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// } from 'chart.js';
// import { api, questions } from '../api/feedbackApi';
// import * as XLSX from 'xlsx';

// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// const departmentColors = {
//   CSE: 'bg-blue-100',
//   IT: 'bg-green-100',
//   ECE: 'bg-yellow-100',
//   EEE: 'bg-purple-100',
//   MECH: 'bg-red-100',
//   'AI-ML': 'bg-pink-100',
//   MECHATRONICS: 'bg-indigo-100',
//   CSBS: 'bg-teal-100',
//   CIVIL: 'bg-orange-100'
// };

// export const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [feedbackData, setFeedbackData] = useState([]);
//   const [filters, setFilters] = useState({ day: 'ALL', dept: 'ALL' });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch('https://sip-1-uple.onrender.com/api/feedback');
//         const data = await res.json();
//         setFeedbackData(data);
//       } catch (error) {
//         console.error("Failed to fetch feedback:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.id]: e.target.value });
//   };

//   const handleLogout = () => {
//     api.logout();
//     navigate('/');
//   };

//   const filteredData = feedbackData.filter(entry => {
//     const dayMatch = filters.day === 'ALL' || entry.day === filters.day;
//     const deptMatch = filters.dept === 'ALL' || entry.dept === filters.dept;
//     return dayMatch && deptMatch;
//   });

//   const getDayNumber = (dayStr) => {
//     const match = dayStr.match(/Day\s*(\d+)/i);
//     return match ? parseInt(match[1], 10) : 0;
//   };

//   const groupedDataObj = filteredData.reduce((acc, entry) => {
//   // Skip if session or session.time is missing
//   if (!entry.session || !entry.session.time) return acc;

//   const key = `${entry.day}-${entry.session.time}`;
//   if (!acc[key]) {
//     acc[key] = {
//       day: entry.day,
//       time: entry.session.time,
//       topic: entry.session.topic || '',
//       entries: []
//     };
//   }
//   acc[key].entries.push(entry);
//   return acc;
// }, {});

//   // Grouped by day + time
//   const groupedData = Object.values(groupedDataObj).sort((a, b) => {
//     const dayA = getDayNumber(a.day);
//     const dayB = getDayNumber(b.day);
//     if (dayA !== dayB) return dayA - dayB;
//     return a.time.localeCompare(b.time);
//   });

//   const submissionCounts = filteredData.reduce((acc, entry) => {
//     acc[entry.dept] = (acc[entry.dept] || 0) + 1;
//     return acc;
//   }, {});

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-4 sm:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">Admin Panel - Feedback</h1>
//           <button onClick={handleLogout} className="bg-red-500 text-white font-bold cursor-pointer py-2 px-4 rounded hover:bg-red-600">Logout</button>
//         </div>

//         {/* Feedback Questions */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
//           <h3 className="text-xl font-semibold mb-4 text-gray-700">📋 Feedback Questions</h3>
//           <ol className="list-decimal list-inside space-y-1 text-gray-600">
//             {Object.entries(questions).map(([key, value]) => (
//               <li key={key}><strong>{key}:</strong> {value}</li>
//             ))}
//           </ol>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200 flex flex-wrap gap-6 items-center">
//           <label className="font-semibold mr-2 text-gray-700">Day:</label>
//           <select id="day" onChange={handleFilterChange} value={filters.day} className="p-2 border rounded-md text-sm cursor-pointer">
//             <option value="ALL">All Days</option>
//             {[...Array(15)].map((_, i) => (
//               <option key={i} value={`Day ${i + 1}`}>Day {i + 1}</option>
//             ))}
//           </select>
//           <label className="font-semibold mr-2 text-gray-700">Department:</label>
//           <select id="dept" onChange={handleFilterChange} value={filters.dept} className="p-2 border rounded-md text-sm cursor-pointer">
//             <option value="ALL">All Departments</option>
//             {Object.keys(departmentColors).map((dept) => (
//               <option key={dept} value={dept}>{dept}</option>
//             ))}
//           </select>
//         </div>

//         {/* Submission Summary */}
//         <div className="bg-white border border-yellow-300 rounded-lg shadow p-6 mb-8">
//           <h3 className="text-xl font-semibold mb-3 text-yellow-600">📊 Submission Summary</h3>
//           {Object.keys(submissionCounts).length > 0 ? (
//             <ul className="list-disc list-inside text-gray-700">
//               {Object.entries(submissionCounts).map(([dept, count]) => (
//                 <li key={dept}><strong>{dept}</strong>: {count}</li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-500">No submissions for selected filters.</p>
//           )}
//         </div>

//         {/* Feedback Charts and Tables */}
//         <div className="space-y-8">
//           {Object.values(groupedData).length > 0 ? Object.values(groupedData).map((group, index) => {
//             // Pie chart: department counts for this group (day+time)
//             const deptCounts = group.entries.reduce((acc, entry) => {
//               acc[entry.dept] = (acc[entry.dept] || 0) + 1;
//               return acc;
//             }, {});

//             const pieData = {
//               labels: Object.keys(deptCounts),
//               datasets: [
//                 {
//                   data: Object.values(deptCounts),
//                   backgroundColor: Object.keys(deptCounts).map(
//                     dept => {
//                       // Use tailwind color classes as hex fallback
//                       const colorMap = {
//                         CSE: '#60a5fa',
//                         IT: '#6ee7b7',
//                         ECE: '#fde68a',
//                         EEE: '#c4b5fd',
//                         MECH: '#fca5a5',
//                         'AI-ML': '#f9a8d4',
//                         MECHATRONICS: '#a5b4fc',
//                         CSBS: '#5eead4',
//                         CIVIL: '#fdba74'
//                       };
//                       return colorMap[dept] || '#d1d5db';
//                     }
//                   )
//                 }
//               ]
//             };

//             const pieOptions = {
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: {
//                 legend: { display: true, position: 'bottom' },
//                 tooltip: { enabled: true }
//               }
//             };

//            const handleDownload = () => {
//             const entries = group.entries;

//             // Get the question keys in order: Q1, Q2, etc.
//             const questionKeys = Object.keys(questions);

//             // Convert entries to a flat object per row for Excel
//             const excelData = entries.map(entry => {
//               const row = {
//                 Name: entry.name || entry.user,
//                 Department: entry.dept
//               };

//               // Map answers to Q1, Q2, ...
//               questionKeys.forEach((qKey, index) => {
//                 row[qKey] = entry.answers[index] || '';
//               });

//               return row;
//             });

//             // Generate worksheet
//             const worksheet = XLSX.utils.json_to_sheet(excelData);

//             // Generate workbook
//             const workbook = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedback');

//             // File name format: Day_10AM_feedback.xlsx
//             const filename = `${group.day.replace(/\s/g, '_')}_${group.time.replace(/\s|:/g, '_')}_feedback.xlsx`;
//             XLSX.writeFile(workbook, filename);
//           };

//             return (
//               <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-800">{group.day} - {group.time}</h3>
//                     <h4 className="text-md font-medium text-gray-600 mb-2">{group.topic}</h4>
//                   </div>
//                   <button
//                     onClick={handleDownload}
//                     className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 text-sm font-semibold"
//                   >
//                     Download
//                   </button>
//                 </div>
//                 <div className="mb-6 h-60 max-w-lg mx-auto">
//                   <Pie data={pieData} options={pieOptions} />
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full table-auto border text-sm">
//                     <thead className="bg-gray-100 text-gray-700">
//                       <tr>
//                         <th className="py-2 px-4 border">Name</th>
//                         <th className="py-2 px-4 border">Department</th>
//                         {Object.keys(questions).map((q, i) => (
//                           <th key={i} className="py-2 px-4 border">{q}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {group.entries.map((entry, i) => (
//                         <tr key={i} className={`text-center hover:bg-gray-50 ${departmentColors[entry.dept] || ''}`}>
//                           <td className="py-2 px-4 border">{entry.name || entry.user}</td>
//                           <td className="py-2 px-4 border font-semibold">{entry.dept}</td>
//                           {/* Always show all questions, even if answers are missing */}
//                           {Object.keys(questions).map((_, j) => (
//                             <td key={j} className="py-2 px-4 border">{entry.answers?.[j] ?? ''}</td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             );
//           }) : (
//             <p className="text-center text-gray-500">No data available for the selected filters.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };









// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Pie } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// } from 'chart.js';
// import { api, questions } from '../api/feedbackApi';
// import * as XLSX from 'xlsx';

// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// const departmentColors = {
//   CSE: 'bg-blue-100',
//   IT: 'bg-green-100',
//   ECE: 'bg-yellow-100',
//   EEE: 'bg-purple-100',
//   MECH: 'bg-red-100',
//   'AI-ML': 'bg-pink-100',
//   MECHATRONICS: 'bg-indigo-100',
//   CSBS: 'bg-teal-100',
//   CIVIL: 'bg-orange-100'
// };

// export const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [feedbackData, setFeedbackData] = useState([]);
//   const [filters, setFilters] = useState({ day: 'ALL', dept: 'ALL' });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch('https://sip-1-uple.onrender.com/api/feedback');
//         const data = await res.json();
//         setFeedbackData(data);
//       } catch (error) {
//         console.error("Failed to fetch feedback:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.id]: e.target.value });
//   };

//   const handleLogout = () => {
//     api.logout();
//     navigate('/');
//   };

//   const filteredData = feedbackData.filter(entry => {
//     const dayMatch = filters.day === 'ALL' || entry.day === filters.day;
//     const deptMatch = filters.dept === 'ALL' || entry.dept === filters.dept;
//     return dayMatch && deptMatch;
//   });

//   const getDayNumber = (dayStr) => {
//     const match = dayStr.match(/Day\s*(\d+)/i);
//     return match ? parseInt(match[1], 10) : 0;
//   };

//   const groupedDataObj = filteredData.reduce((acc, entry) => {
//   // Skip if session or session.time is missing
//   if (!entry.session || !entry.session.time) return acc;

//   const key = `${entry.day}-${entry.session.time}`;
//   if (!acc[key]) {
//     acc[key] = {
//       day: entry.day,
//       time: entry.session.time,
//       topic: entry.session.topic || '',
//       entries: []
//     };
//   }
//   acc[key].entries.push(entry);
//   return acc;
// }, {});

//   // Grouped by day + time
//   const groupedData = Object.values(groupedDataObj).sort((a, b) => {
//     const dayA = getDayNumber(a.day);
//     const dayB = getDayNumber(b.day);
//     if (dayA !== dayB) return dayA - dayB;
//     return a.time.localeCompare(b.time);
//   });

//   const submissionCounts = filteredData.reduce((acc, entry) => {
//     acc[entry.dept] = (acc[entry.dept] || 0) + 1;
//     return acc;
//   }, {});

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-4 sm:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">Admin Panel - Feedback</h1>
//           <button onClick={handleLogout} className="bg-red-500 text-white font-bold cursor-pointer py-2 px-4 rounded hover:bg-red-600">Logout</button>
//         </div>

//         {/* Feedback Questions */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
//           <h3 className="text-xl font-semibold mb-4 text-gray-700">📋 Feedback Questions</h3>
//           <ol className="list-decimal list-inside space-y-1 text-gray-600">
//             {Object.entries(questions).map(([key, value]) => (
//               <li key={key}><strong>{key}:</strong> {value}</li>
//             ))}
//           </ol>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200 flex flex-wrap gap-6 items-center">
//           <label className="font-semibold mr-2 text-gray-700">Day:</label>
//           <select id="day" onChange={handleFilterChange} value={filters.day} className="p-2 border rounded-md text-sm cursor-pointer">
//             <option value="ALL">All Days</option>
//             {[...Array(15)].map((_, i) => (
//               <option key={i} value={`Day ${i + 1}`}>Day {i + 1}</option>
//             ))}
//           </select>
//           <label className="font-semibold mr-2 text-gray-700">Department:</label>
//           <select id="dept" onChange={handleFilterChange} value={filters.dept} className="p-2 border rounded-md text-sm cursor-pointer">
//             <option value="ALL">All Departments</option>
//             {Object.keys(departmentColors).map((dept) => (
//               <option key={dept} value={dept}>{dept}</option>
//             ))}
//           </select>
//         </div>

//         {/* Submission Summary */}
//         <div className="bg-white border border-yellow-300 rounded-lg shadow p-6 mb-8">
//           <h3 className="text-xl font-semibold mb-3 text-yellow-600">📊 Submission Summary</h3>
//           {Object.keys(submissionCounts).length > 0 ? (
//             <ul className="list-disc list-inside text-gray-700">
//               {Object.entries(submissionCounts).map(([dept, count]) => (
//                 <li key={dept}><strong>{dept}</strong>: {count}</li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-500">No submissions for selected filters.</p>
//           )}
//         </div>

//         {/* Feedback Charts and Tables */}
//         <div className="space-y-8">
//           {Object.values(groupedData).length > 0 ? Object.values(groupedData).map((group, index) => {
//             // Pie chart: department counts for this group (day+time)
//             const deptCounts = group.entries.reduce((acc, entry) => {
//               acc[entry.dept] = (acc[entry.dept] || 0) + 1;
//               return acc;
//             }, {});

//             const pieData = {
//               labels: Object.keys(deptCounts),
//               datasets: [
//                 {
//                   data: Object.values(deptCounts),
//                   backgroundColor: Object.keys(deptCounts).map(
//                     dept => {
//                       // Use tailwind color classes as hex fallback
//                       const colorMap = {
//                         CSE: '#60a5fa',
//                         IT: '#6ee7b7',
//                         ECE: '#fde68a',
//                         EEE: '#c4b5fd',
//                         MECH: '#fca5a5',
//                         'AI-ML': '#f9a8d4',
//                         MECHATRONICS: '#a5b4fc',
//                         CSBS: '#5eead4',
//                         CIVIL: '#fdba74'
//                       };
//                       return colorMap[dept] || '#d1d5db';
//                     }
//                   )
//                 }
//               ]
//             };

//             const pieOptions = {
//               responsive: true,
//               maintainAspectRatio: false,
//               plugins: {
//                 legend: { display: true, position: 'bottom' },
//                 tooltip: { enabled: true }
//               }
//             };

//            const handleDownload = () => {
//             const entries = group.entries;

//             // Get the question keys in order: Q1, Q2, etc.
//             const questionKeys = Object.keys(questions);

//             // Convert entries to a flat object per row for Excel
//             const excelData = entries.map(entry => {
//               const row = {
//   Name: entry.name || entry.user,
//   Department: entry.dept,
//   Slot: entry.slot || ''
// };


//               // Map answers to Q1, Q2, ...
//               questionKeys.forEach((qKey, index) => {
//                 row[qKey] = entry.answers[index] || '';
//               });

//               return row;
//             });

//             // Generate worksheet
//             const worksheet = XLSX.utils.json_to_sheet(excelData);

//             // Generate workbook
//             const workbook = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedback');

//             // File name format: Day_10AM_feedback.xlsx
//             const filename = `${group.day.replace(/\s/g, '_')}_${group.time.replace(/\s|:/g, '_')}_feedback.xlsx`;
//             XLSX.writeFile(workbook, filename);
//           };

//             return (
//               <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-800">{group.day} - {group.time}</h3>
//                     <h4 className="text-md font-medium text-gray-600 mb-2">{group.topic}</h4>
//                   </div>
//                   <button
//                     onClick={handleDownload}
//                     className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 text-sm font-semibold"
//                   >
//                     Download
//                   </button>
//                 </div>
//                 <div className="mb-6 h-60 max-w-lg mx-auto">
//                   <Pie data={pieData} options={pieOptions} />
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full table-auto border text-sm">
//                     <thead className="bg-gray-100 text-gray-700">
//   <tr>
//     <th className="py-2 px-4 border">Name</th>
//     <th className="py-2 px-4 border">Department</th>
//     <th className="py-2 px-4 border">Slot</th>
//     {Object.keys(questions).map((q, i) => (
//       <th key={i} className="py-2 px-4 border">{q}</th>
//     ))}
//   </tr>
// </thead>

//                     <tbody>
//                       {group.entries.map((entry, i) => (
//                         <tr key={i} className={`text-center hover:bg-gray-50 ${departmentColors[entry.dept] || ''}`}>
//                           <td className="py-2 px-4 border">{entry.name || entry.user}</td>
//                          <td className="py-2 px-4 border font-semibold">{entry.dept}</td>
// <td className="py-2 px-4 border">{entry.slot || ''}</td>
// {/* Always show all questions, even if answers are missing */}
// {Object.keys(questions).map((_, j) => (
//   <td key={j} className="py-2 px-4 border">{entry.answers?.[j] ?? ''}</td>
// ))}

//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             );
//           }) : (
//             <p className="text-center text-gray-500">No data available for the selected filters.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };








import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { api, questions } from '../api/feedbackApi';
import * as XLSX from 'xlsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const departmentColors = {
  CSE: 'bg-blue-100',
  IT: 'bg-green-100',
  ECE: 'bg-yellow-100',
  EEE: 'bg-purple-100',
  MECH: 'bg-red-100',
  'AI-ML': 'bg-pink-100',
  MECHATRONICS: 'bg-indigo-100',
  CSBS: 'bg-teal-100',
  CIVIL: 'bg-orange-100'
};

// 🔹 Adjust this to the actual total expected feedback per session
const TOTAL_EXPECTED_PER_SESSION = 60;

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState([]);
  const [filters, setFilters] = useState({ day: 'ALL', dept: 'ALL' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://sip-1-uple.onrender.com/api/feedback');
        const data = await res.json();
        setFeedbackData(data);
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.id]: e.target.value });
  };

  const handleLogout = () => {
    api.logout();
    navigate('/');
  };

  const filteredData = feedbackData.filter(entry => {
    const dayMatch = filters.day === 'ALL' || entry.day === filters.day;
    const deptMatch = filters.dept === 'ALL' || entry.dept === filters.dept;
    return dayMatch && deptMatch;
  });

  const getDayNumber = (dayStr) => {
    const match = dayStr.match(/Day\s*(\d+)/i);
    return match ? parseInt(match[1], 10) : 0;
  };

  const groupedDataObj = filteredData.reduce((acc, entry) => {
    if (!entry.session || !entry.session.time) return acc;
    const key = `${entry.day}-${entry.session.time}`;
    if (!acc[key]) {
      acc[key] = {
        day: entry.day,
        time: entry.session.time,
        topic: entry.session.topic || '',
        entries: []
      };
    }
    acc[key].entries.push(entry);
    return acc;
  }, {});

  const groupedData = Object.values(groupedDataObj).sort((a, b) => {
    const dayA = getDayNumber(a.day);
    const dayB = getDayNumber(b.day);
    if (dayA !== dayB) return dayA - dayB;
    return a.time.localeCompare(b.time);
  });

  const submissionCounts = filteredData.reduce((acc, entry) => {
    acc[entry.dept] = (acc[entry.dept] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel - Feedback</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white font-bold cursor-pointer py-2 px-4 rounded hover:bg-red-600">Logout</button>
        </div>

        {/* Feedback Questions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">📋 Feedback Questions</h3>
          <ol className="list-decimal list-inside space-y-1 text-gray-600">
            {Object.entries(questions).map(([key, value]) => (
              <li key={key}><strong>{key}:</strong> {value}</li>
            ))}
          </ol>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200 flex flex-wrap gap-6 items-center">
          <label className="font-semibold mr-2 text-gray-700">Day:</label>
          <select id="day" onChange={handleFilterChange} value={filters.day} className="p-2 border rounded-md text-sm cursor-pointer">
            <option value="ALL">All Days</option>
            {[...Array(15)].map((_, i) => (
              <option key={i} value={`Day ${i + 1}`}>Day {i + 1}</option>
            ))}
          </select>
          <label className="font-semibold mr-2 text-gray-700">Department:</label>
          <select id="dept" onChange={handleFilterChange} value={filters.dept} className="p-2 border rounded-md text-sm cursor-pointer">
            <option value="ALL">All Departments</option>
            {Object.keys(departmentColors).map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Submission Summary */}
        <div className="bg-white border border-yellow-300 rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold mb-3 text-yellow-600">📊 Submission Summary</h3>
          {Object.keys(submissionCounts).length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {Object.entries(submissionCounts).map(([dept, count]) => (
                <li key={dept}><strong>{dept}</strong>: {count}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No submissions for selected filters.</p>
          )}
        </div>

        {/* Feedback Charts and Tables */}
        <div className="space-y-8">
          {groupedData.length > 0 ? groupedData.map((group, index) => {
            const deptCounts = group.entries.reduce((acc, entry) => {
              acc[entry.dept] = (acc[entry.dept] || 0) + 1;
              return acc;
            }, {});

            const missingCount = TOTAL_EXPECTED_PER_SESSION - group.entries.length;

            const pieData = {
              labels: Object.keys(deptCounts),
              datasets: [
                {
                  data: Object.values(deptCounts),
                  backgroundColor: Object.keys(deptCounts).map(dept => {
                    const colorMap = {
                      CSE: '#60a5fa',
                      IT: '#6ee7b7',
                      ECE: '#fde68a',
                      EEE: '#c4b5fd',
                      MECH: '#fca5a5',
                      'AI-ML': '#f9a8d4',
                      MECHATRONICS: '#a5b4fc',
                      CSBS: '#5eead4',
                      CIVIL: '#fdba74'
                    };
                    return colorMap[dept] || '#d1d5db';
                  })
                }
              ]
            };

            const pieOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true, position: 'bottom' },
                tooltip: { enabled: true }
              }
            };

            const handleDownload = () => {
              const entries = group.entries;
              const questionKeys = Object.keys(questions);

              const excelData = entries.map(entry => {
                const row = {
                  Name: entry.name || entry.user,
                  Department: entry.dept,
                  Slot: entry.slot || ''
                };
                questionKeys.forEach((qKey, idx) => {
                  row[qKey] = entry.answers[idx] || '';
                });
                return row;
              });

              const worksheet = XLSX.utils.json_to_sheet(excelData);
              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedback');

              const filename = `${group.day.replace(/\s/g, '_')}_${group.time.replace(/\s|:/g, '_')}_feedback.xlsx`;
              XLSX.writeFile(workbook, filename);
            };

            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{group.day} - {group.time}</h3>
                    <h4 className="text-md font-medium text-gray-600 mb-2">{group.topic}</h4>
                    <p className="text-sm text-red-600 font-semibold">Missing Feedbacks: {missingCount > 0 ? missingCount : 0}</p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 text-sm font-semibold"
                  >
                    Download
                  </button>
                </div>
                <div className="mb-6 h-60 max-w-lg mx-auto">
                  <Pie data={pieData} options={pieOptions} />
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="py-2 px-4 border">Name</th>
                        <th className="py-2 px-4 border">Department</th>
                        <th className="py-2 px-4 border">Slot</th>
                        {Object.keys(questions).map((q, i) => (
                          <th key={i} className="py-2 px-4 border">{q}</th>
                        ))}
                        <th className="py-2 px-4 border bg-red-100">Missing Feedbacks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.entries.map((entry, i) => (
                        <tr key={i} className={`text-center hover:bg-gray-50 ${departmentColors[entry.dept] || ''}`}>
                          <td className="py-2 px-4 border">{entry.name || entry.user}</td>
                          <td className="py-2 px-4 border font-semibold">{entry.dept}</td>
                          <td className="py-2 px-4 border">{entry.slot || ''}</td>
                          {Object.keys(questions).map((_, j) => (
                            <td key={j} className="py-2 px-4 border">{entry.answers?.[j] ?? ''}</td>
                          ))}
                          {i === 0 && (
                            <td className="py-2 px-4 border bg-red-50 font-semibold text-red-600" rowSpan={group.entries.length}>
                              {missingCount > 0 ? missingCount : 0}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }) : (
            <p className="text-center text-gray-500">No data available for the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

