import streamlit as st
import openai
import os

# Configurar a API Key usando variável de ambiente
openai.api_key = os.getenv("OPENAI_API_KEY")  

def chat_with_openai(user_input):
    client = openai.OpenAI()
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": user_input}]
    )
    return response.choices[0].message.content

st.title("🤖 Chatbot com OpenAI no Streamlit")
st.write("Digite sua mensagem abaixo:")

user_input = st.text_input("Você:", "")

if st.button("Enviar"):
    if user_input:
        with st.spinner("Pensando..."):
            resposta = chat_with_openai(user_input)
            st.text_area("🤖 Resposta:", resposta, height=200)
    else:
        st.warning("Por favor, digite uma mensagem antes de enviar.")

st.sidebar.info("🚀 Desenvolvido com Streamlit e OpenAI")
