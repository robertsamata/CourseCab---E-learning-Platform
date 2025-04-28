import { createChatBotMessage } from 'react-chatbot-kit';
import QuizResponse from './QuizResponse';

const config = {
  initialMessages: [createChatBotMessage(`Please type 'start' if you are ready to start the quiz.`)],
  widgets: [
    {
      widgetName: 'quizResponse',
      widgetFunc: (props) => <QuizResponse props={props} />,
    },
  ],
};

export default config;