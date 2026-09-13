import {useState} from 'react';
import Ai from '../Style/Ai.css'
function AiChat(){

    const api_key = 'AIzaSyBO0HjKURjxeHOutubscCiD9xfAf8PUooY';


    const[ai , setAi] = useState(null);
    const[ask , setAsk] = useState('');

    const fetchAi = async() => {

        const response = await fetch( `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${api_key}`,

            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    contents: [{
                        parts: [{text: `You are a fitness assistant. Only answer fitness, nutrition, and health related questions. User asks: ${ask}`}]  // ← your question goes here
                    }]
                })
            }
        );

        const data = await response.json();
        console.log("full response:", data);

        if (data.candidates) {
            setAi(data.candidates[0].content.parts[0].text);
        } else {
            setAi("Something went wrong, try again.");
        }



    };



    return (
        <div className={'ai'}>
            <div className={'ai-card'}>
                <div className={'ai-title'}>Ask the Fitness AI</div>

                <div className={'ai-row'}>
                    <input
                        className={'user-question'}
                        value={ask}
                        onChange={(e) => setAsk(e.target.value)}
                        placeholder="Ask me anything about fitness..."
                    />
                    <button onClick={fetchAi} className={'ai-btn'}>Ask</button>
                </div>

                {ai && <p className={'ai-answer'}>{ai}</p>}
            </div>
        </div>
    );



}

export default AiChat;