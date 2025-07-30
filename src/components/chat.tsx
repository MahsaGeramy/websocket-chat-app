import React, { useEffect, useRef, useState } from 'react';

interface Message {
    sender: string;
    message: string;
    time: string;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');
    const socketRef = useRef<WebSocket | null>(null);

    const getBrowserName = () => {
        const ua = window.navigator.userAgent;

        if (ua.includes('Edg/')) {       // Edge (Chromium-based)
            return 'Edge';
        } else if (ua.includes('OPR') || ua.includes('Opera')) {  // Opera
            return 'Opera';
        } else if (ua.includes('Chrome')) {  // Chrome
            return 'Chrome';
        } else if (ua.includes('Firefox')) {
            return 'Firefox';
        } else if (ua.includes('Safari')) {
            return 'Safari';
        } else {
            return 'Unknown';
        }
    };

    const sender = getBrowserName();

    useEffect(() => {
        socketRef.current = new WebSocket('ws://localhost:8080');

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
        };

        return () => {
            socketRef.current?.close();
        };
    }, []);

    const sendMessage = () => {
        if (text.trim() === '') return;
        const message = {
            sender,
            message: text,
        };
        socketRef.current?.send(JSON.stringify(message));
        setText('');
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>💬 WebSocket Chat</h2>
            <div style={{ border: '1px solid #ccc', height: 300, overflowY: 'scroll', padding: 10 }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                        <strong>{msg.sender}</strong> <small>{msg.time}</small>
                        <div>{msg.message}</div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: 10 }}>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    style={{ width: '80%', padding: 5 }}
                />
                <button onClick={sendMessage} style={{ padding: '5px 10px', marginLeft: 10 }}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
