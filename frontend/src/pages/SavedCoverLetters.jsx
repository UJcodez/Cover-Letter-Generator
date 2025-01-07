import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../components/Navbar.css'

function SavedCoverLetters({ onLogout }) {
    const [coverLetters, setCoverLetters] = useState([]);
    const [loading, setLoading] = useState(true); // Optional: for showing a loading indicator
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user_id');
        onLogout();
        navigate("/login");
      }

    useEffect(() => {
        const fetchCoverLetters = async () => {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                console.error("User ID not found in localStorage.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:5000/get-cover-letters/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setCoverLetters(data);
                } else {
                    console.error("Error fetching cover letters: ", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching cover letters: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoverLetters();
    }, []);

    if (loading) {
        return <p>Loading cover letters...</p>;
    }
    

    return (
        <div className='page-content'>
            <Navbar handleLogout={handleLogout} />
            <h2>Saved Cover Letters</h2>
            {coverLetters.length > 0 ? (
                <ul>
                    {coverLetters.map((cl) => (
                        <li key={cl.id}>
                            <p>{cl.content}</p>
                            <small>Saved on: {new Date(cl.created_at).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No saved cover letters found.</p>
            )}
        </div>
    );
}

export default SavedCoverLetters;
