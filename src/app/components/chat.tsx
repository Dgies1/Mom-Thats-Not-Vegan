'use client'
import React, { useState,useRef } from 'react';
import { askQuestion } from '../actions';

export const Chat = () => {
    const questionInput = useRef<HTMLInputElement>(null);
    const [chatHistory, setChatHistory] = useState<{ question: string; answer: string }[]>([]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const question = formData.get('question')?.toString();

        if (question) {
            const response = await askQuestion({ question });
            setChatHistory((prev) => [...prev, { question, answer: response.message }]);
            if (questionInput.current) {
              questionInput.current.value = '';
            }
          }
        };
      

    return (
        <>
            <form onSubmit={handleSubmit} className="card-body h-[85vh] sm:h-full sm:mb-0 p-0 justify-content-end sm:justify-end">
                <div className="flex flex-col h-5/6 md:h-full overflow-y-auto w-full rounded">
                    <div className="p-4">
                        {chatHistory.map((entry, index) => (
                            <div key={index}>
                                <div className="chat chat-start">
                                    <div className="chat-bubble chat-bubble-secondary">{entry.question}</div>
                                </div>
                                <div className="chat chat-end">
                                    <div className="chat-bubble chat-bubble-primary">{entry.answer}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card-actions items-start flex-col justify-end w-full">
                    <div className="join w-full">
                        <input name="question" ref={questionInput} className="input input-bordered join-item w-full" placeholder="Is It Vegan?" />
                        <button type="submit" className="btn join-item rounded-r-md">Ask</button>
                    </div>
                </div>
            </form>
        </>
    );
};
