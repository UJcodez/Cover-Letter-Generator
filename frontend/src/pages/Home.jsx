import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Navbar from '../components/Navbar';
import '../components/Navbar.css'

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

    const handleDownloadPDF = () => {
      if (!aiResponse) {
        alert("please enter your resume first");
        return;
      }

      const pdf = new jsPDF('p', 'mm', 'letter');
      pdf.setFont('Arial', 'normal');
      pdf.setFontSize(12);
      pdf.text(10, 20, aiResponse);
      pdf.save('cover_letter.pdf');
    };

    const saveCoverLetter = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/save-cover-letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: localStorage.getItem('user_id'),
            content: aiResponse,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          alert('Cover Letter Saved Successfully');
        } else {
          console.error('Error saving cover letter: ', data.error);
        }

      } catch (error) {
        console.error('Error: ', error);
      }
    };

    return (
        <div className='page-content'>
          <Navbar handleLogout={handleLogout} />
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
              <div className="response-box">
                {aiResponse}
              </div>
              <br />
              <button onClick={handleDownloadPDF}>Download Cover Letter</button>
              <button onClick={saveCoverLetter}>Save Cover Letter</button>
            </div>
          )}
        </div>
      );
    }

export default Home;