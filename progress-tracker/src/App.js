import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Assuming you've created an App.css file for styling

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/questions")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleToggle = (index) => {
    const updatedData = [...data];
    updatedData[index].status =
      updatedData[index].status === "Completed" ? "Not Completed" : "Completed";

    axios
      .post("http://localhost:3001/update", updatedData)
      .then(() => {
        setData(updatedData);

        // Clear the selectedQuestion state if its status is updated
        if (
          selectedQuestion &&
          selectedQuestion.problem_name === updatedData[index].problem_name
        ) {
          setSelectedQuestion(null);
        }
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  const handlePickOne = () => {
    const notCompletedQuestions = data.filter(
      (item) => item.status === "Not Completed"
    );
    if (notCompletedQuestions.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * notCompletedQuestions.length
      );
      setSelectedQuestion(notCompletedQuestions[randomIndex]);
    }
  };

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  const completedCount = data.filter(
    (item) => item.status === "Completed"
  ).length;

  return (
    <div className="app-container">
      <h1 className="app-title">Amazon Questions List</h1>

      <div className="status-info">
        <b>
          Completed: {completedCount} / Total: {data.length}
        </b>
      </div>
      <button className="app-button" onClick={handlePickOne}>
        Pick One
      </button>

      {selectedQuestion && (
        <table className="questions-table">
          <tbody>
            <tr
              className={
                selectedQuestion.status === "Completed"
                  ? "completed-row"
                  : "not-completed-row"
              }
            >
              <td>
                <a
                  className="selected-question-link"
                  href={selectedQuestion.problem_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedQuestion.problem_name}
                </a>
              </td>
              <td>
                <button
                  className="selected-question-toggle"
                  onClick={() => handleToggle(data.indexOf(selectedQuestion))}
                >
                  {selectedQuestion.status}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      <table className="questions-table">
        <thead>
          <tr>
            <th>Sno</th>
            <th>Problem</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={
                item.status === "Completed"
                  ? "completed-row"
                  : "not-completed-row"
              }
            >
              <td>{index + 1}</td>
              <td>
                <a
                  href={item.problem_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.problem_name}
                </a>
              </td>
              <td>
                <button
                  onClick={() => handleToggle(index)}
                  className={
                    item.status === "Completed"
                      ? "completed-button"
                      : "not-completed-button"
                  }
                >
                  {item.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
