from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate
from langchain_groq import ChatGroq

#! API KEY: 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

def trigger_llama_chain(input_text):
    system = "You are a quiz generator, and you will generate a 10 question quiz based on the following knowledge: {content}. You will provide only the questions, not the answers also, and provider user choices (4 variants)."

    llm = ChatGroq( 
    temperature=0,
    model="llama3-70b-8192",
    api_key="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"
    )
# promptul pentru model primeste 2 tipuri de valori(system si human) cu care se genereaza intrebarea pt llm(in cazul asta)
# contextul system este folosit ca mesaj initial al modelului iar sarcina modelului in sine este redata de mesajul tip human
    prompt = ChatPromptTemplate.from_messages([("system", system), ("human", "Generate a quiz.")])

    chain = prompt | llm
    response = chain.invoke({"content": input_text})

    return response.content


def evaluate_quiz(input_text, quiz_string, answers):
    system = """
    Based on your knowledge (your knowledge is {content}), evaluate this quiz: {quiz} based on a set of answers received as input. 
    Grade it from 1 to 10 and mention the grading like: <grade>. You will only output the synthax showing the grade."""

    llm = ChatGroq(
    temperature=0,
    model="llama3-70b-8192",
    api_key="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"
    )

    prompt = ChatPromptTemplate.from_messages([("system", system), ("human", answers)])

    chain = prompt | llm
    response = chain.invoke({"content": input_text, "quiz": quiz_string})

    return {"grade": response.content}