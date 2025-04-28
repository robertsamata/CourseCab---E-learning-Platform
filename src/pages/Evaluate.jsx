import { useState } from "react";
import Layout from "../components/Layout";
import ChatBot from "react-chatbotify";
import Cookies from "js-cookie";

function Evaluate() {
  const [quizString, setQuizString] = useState("");
  const [grade, setGrade] = useState(null);

  const fetchQuiz = async () => {
    const response = await fetch(
      `/api/evaluate/${window.location.pathname.replace("/evaluate/", "")}`
    ).then(async (res) => await res.json());

    setQuizString(response.quiz);

    return response.quiz + "\n Type your answer to every question and submit.";
  };

  const fetchQuizEvaluation = async (answers) => {
    setGrade("Loading...")
    const token = Cookies.get("token");

    const response = await fetch(`/api/evaluate/${window.location.pathname.replace("/evaluate/", "")}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quiz: quizString,
        answers: answers,
      }),
    }).then(async (res) => await res.json()).catch((error) => {
      throw new Error(error);
    });

    setGrade(response.grade)

    return response.grade;
  };

  const flow = {
    start: {
      message:
        "Type in 'start' to generate your quiz. This may take up to 2 minutes.",
      path: "quiz",
    },
    quiz: {
      message: async (params) => {
        if (params.userInput.toLowerCase() === "start") {
          try {
            return await fetchQuiz();
          } catch {
            return "Something went wrong. Please try again.";
          }
        } else return "Something went wrong. Please try again.";
      },
      path: () => {
        if (quizString) {
          return "evaluate";
        }
        return "quiz";
      },
    },
    evaluate: {
      message: async (params) => {
        const answers = params.userInput;

        return await fetchQuizEvaluation(answers);
      },
    },
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-10 items-center h-screen w-screen justify-center">
        <div className="w-full text-center text-5xl">
          Evaluate Your Skills!
        </div>
        <ChatBot
          options={{
            theme: { embedded: true },
            chatHistory: { storageKey: "conversations_summary" },
          }}
          flow={flow}
        />
        {grade ? (
          <div className="w-full text-center text-3xl h-16">Grade: {grade}</div>
        ) : <div className="w-full h-16" />}
      </div>
    </Layout>
  );
}

export default Evaluate;
