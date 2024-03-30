import requests
import json
import pandas as pd
import pinecone
from sentence_transformers import SentenceTransformer
import os
import time
import torch
import langchain
import numpy as np
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.chains import RetrievalQAWithSourcesChain
from langchain.vectorstores import Pinecone
import sys
import os
import re
from flask import *
from flask_cors import CORS
from langchain import *

# Initialize Flask app:

app = Flask(__name__)
CORS(app)

# Initialize encoder model:

device = 'cuda' if torch.cuda.is_available() else 'cpu'

model = SentenceTransformer('all-MiniLM-L6-v2', device=device)

# Provide Pinecone Index access:

PINECONE_API_KEY = os.environ.get('key') or 'key'
PINECONE_ENV = os.environ.get('us-west4-gcp') or 'us-west4-gcp'

pinecone.init(
    api_key=PINECONE_API_KEY,
    environment=PINECONE_ENV
)

index = pinecone.Index("startups")

# Generate embeddings for any textual input:

def embed(text):
  return model.encode(text).tolist()

# Create Pinecone object to use its index for vector search:

vectorstore = Pinecone(
   index=index, embedding_function=embed, text_key="text"
)

# Initialize LLM for QA:

llm = ChatOpenAI(
    openai_api_key='key',
    model_name='gpt-3.5-turbo',
    temperature=0.5
)

prompt = PromptTemplate(
    input_variables=["text"],
    template="{text}",
)

qa_general = LLMChain(llm=llm, prompt=prompt)

qa = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# Regular search from Pinecone vector database:

@app.route('/regsearch/<query>', methods=['GET'])

def regsearch(query, k=3):
  results = []
  for i in range(k):
    results.append(vectorstore.similarity_search(query,k)[i].page_content)
  return "<br><br>1) " + results[0] + "<br><br>2) " + results[1] + "<br><br>3) " + results[2]

# AI search using LLM with Pinecone vector database as retreiver:

@app.route('/search/<query>', methods=['GET'])

def search(query):
  return qa.run(query)

def gsearch(query):
  return qa_general.run(query)

@app.route('/search', methods=['POST'])

def handle_search():
    data = request.get_json()
    q = data.get('query')
    result = search(q)
    return jsonify({'result': result})

@app.route('/gsearch', methods=['POST'])

def handle_gsearch():
    data = request.get_json()
    q = data.get('query')
    result = gsearch(q)
    return jsonify({'result': result})

# Welcome statement: 

@app.route('/')

def hello():
    return "<br><br>Welcome to startupGPT!<br><br> To have our AI help you, please do /search/your_query <br><br> Thank you!"

# Run Flask

app.run()