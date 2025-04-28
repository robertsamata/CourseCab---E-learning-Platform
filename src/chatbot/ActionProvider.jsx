/* eslint-disable react/prop-types */
import React from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleStart = () => {
    const botMessage = createChatBotMessage('Computing your quiz, this may take up to 1 or 2 minutes...', {
      "widget": 'quizResponse'
    });

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleStart
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;