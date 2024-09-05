import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [userInput, setUserInput] = useState("")
    const [aiResponse, setAiResponse] = useState("")

    const handleLogout = () => {
      localStorage.removeItem('isLoggedIn');
      navigate("/login");
    }

    const handleGenerateResponse = async () => {
      const starterInput = "Write a small cover letter based on this resume: ";
      const fullInput = starterInput + userInput

        try {
            const response = await fetch('http://127.0.0.1:5000/generate-cover-letter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({input: fullInput})
            });
            const data = await response.json();
            setAiResponse(data.response);

        } catch (error) {
            console.error('Error generating response:', error);
        }
    }

    return (
        <div>
          <h2>Generate Cover Letter</h2>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your resume here"
            rows={5}
            cols={50}
          />
          <br />
          <button onClick={handleGenerateResponse}>Generate Response</button>
          {aiResponse && (
            <div>
              <h3>Cover Letter:</h3>
              <p>{aiResponse}</p>
            </div>
          )}
          <div>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        </div>
      );
    }

export default Home;