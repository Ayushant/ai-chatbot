import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [conversation, setConversation] = useState([]);
  const textareaRef = useRef(null);

  // Calling API
  async function generateAnswer() {
    if (question.trim() === '') return;
    setAnswer('Loading...');
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAyyNudIUyh7amCc8YcCVyBtrK9JeSMrKI',
        {
          contents: [{ parts: [{ text: question }] }],
        }
      );
      const newAnswer = response.data.candidates[0].content.parts[0].text;
      setConversation([...conversation, { question, answer: newAnswer }]);
      setAnswer('');
      setQuestion('');
    } catch (error) {
      setAnswer('An error occurred. Please try again.');
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevents adding a new line in the textarea
        generateAnswer();
      }
    };

    const textarea = textareaRef.current;
    textarea.addEventListener('keydown', handleKeyDown);

    return () => {
      textarea.removeEventListener('keydown', handleKeyDown);
    };
  }, [question]);

  return (
    <div className="chat-container">
      <div className="chat-box">
        {conversation.map((entry, index) => (
          <div key={index} className="chat-entry">
            <p className="question"><strong>You:</strong> {entry.question}</p>
            <p className="answer"><strong>AI:</strong> {entry.answer}</p>
          </div>
        ))}
        {answer && <p className="loading">{answer}</p>}
      </div>
      <div className="input-container">
        <textarea
          ref={textareaRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me anything..."
          className="textarea"
        ></textarea>
        <button onClick={generateAnswer} className="button">
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
