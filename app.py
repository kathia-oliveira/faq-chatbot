import streamlit as st
import openai
import os

# Configurar a API Key da OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")  # Defina sua API Key no ambiente

st.title("🤖 Chatbot com OpenAI no Streamlit")

# Caixa de entrada do usuário
user_input = st.text_input("Digite sua pergunta:")

if st.button("Enviar"):
    if user_input:
        try:
            # Fazer a requisição para o modelo da OpenAI
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[{"role": "user", "content": user_input}]
            )
            st.write("**Resposta:**")
            st.write(response["choices"][0]["message"]["content"])
        except Exception as e:
            st.error(f"Erro: {e}")
    else:
        st.warning("Por favor, digite algo antes de enviar.")
