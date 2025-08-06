import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/feedbackApi';
import '../index.css'

export const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const success = api.login(password);
        if (success) {
            navigate('/admin');
        } else {
            setError('Incorrect password.');
        }
    };

    return (
        <div className="min-h-screen  flex flex-col items-center justify-center p-4" >
            <img src="images/college_logo.png" alt="College Logo" className="w-20 max-w-md h-auto mb-4 rounded-lg shadow-lg" />     
{/*             <h1 className="text-2xl font-bold text-center text-white-800 mb-8">First Year Student Induction Programme-Feedback Portal</h1> */}
            <h1 className="text-2xl font-bold text-center text-red-900 bg-white px-6 py-4 rounded-md shadow mb-8">
  First Year Student Induction Programme - Feedback Portal
</h1>


            <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Admin Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Admin Password"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                    />
                    <button type="submit" className="w-full cursor-pointer bg-indigo-500 text-white font-bold p-3 rounded-lg hover:bg-indigo-600 transition-colors">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
