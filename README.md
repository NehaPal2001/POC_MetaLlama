# POC_MetaLlama  

This project demonstrates the use of Meta Llama API for evaluating user answers based on predefined criteria.  

## **Getting Started**  

Follow these steps to set up and run the project locally:  

### **1. Clone the Repository**  
Clone the repository to your local machine using the following command:  

```bash  
git clone <repository-url>  

**2. Install Dependencies**
Navigate to the project directory and install the required dependencies using:

```
bash
```

Copy code
`npm install`
**3. Create a **`.env` File
In the root of the project, create a `.env` file and add your GitHub API token as shown below:

```
plaintext
```

Copy code
`GITHUB_TOKEN=`
Replace `` with your actual GitHub API token.
**4. Start the Server**
Run the server using:

```
bash
```

Copy code
`npm start`
The server will start on port `3000` by default.
**5. Test the API**
Use Postman or any HTTP client to test the API.
**Endpoint**:
`POST http://localhost:3000/evaluate-answer`
**Request Body Format**:
Provide the question and the user's answer in the following JSON format:

```
json
```

Copy code
`{ "question": "What is java?", "user_answer": "java is a programming language" }`
**6. Expected Response**
The API will evaluate the answer and return one of the following feedback:
* **Good**: The answer meets all criteria with sufficient depth and context.
* **Partially_Correct**: The answer is somewhat correct but lacks depth or context.
* **Incorrect**: The answer does not meet the criteria or is insufficient.
**Example Response**
If the answer is "java is a programming language," the response might be:

```
json
```

Copy code
`{ "evaluation": "Incorrect" }`
If the answer is more detailed, like: "Java is a versatile programming language designed for cross-platform application development..." The response might be:

```
json
```

Copy code
`{ "evaluation": "Good" }`
**Contact**
For any issues or queries, please feel free to contact the project maintainer.

```
vbnet
```

Copy code
`Let me know if additional sections or modifications are needed! `   
