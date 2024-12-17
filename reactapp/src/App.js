import React, { useState, useEffect } from "react";

const App = () => {
  const [selectedTable, setSelectedTable] = useState("Company");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({});
  const [deleteId, setDeleteId] = useState(""); // For single delete input
  const [filterText, setFilterText] = useState(""); // For filtering by primary key
  const [view, setView] = useState("read");
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [primaryKey, setPrimaryKey] = useState("");
  const [selectedQuery, setSelectedQuery] = useState(""); // To store the selected query ID
  const [queryResults, setQueryResults] = useState([]); // To store the results of the executed query
  
  const queries = [
    "List all companies and their stock tickers",
    "Find all companies from the Technology sector",
    "Get the stock ticker and end of day price for Apple",
    "Find the companies with IPO dates after 2010",
    "Retrieve the total revenue and net income for Apple",
    "Get the total debt for Consumer Cyclical sector companies",
    "List all companies with a gross profit greater than 50 million",
    "Find companies with total assets greater than 1 billion",
    "Get the fiscal year-end date for Microsoft (2021-2024)",
    "Find all companies with working capital greater than 50 million",
    "Get names of companies in the 'Software Infrastructure' industry",
    "Retrieve total revenue and cost of revenue for Tesla",
    "Find companies with net income for common stockholders > 10 million",
    "Retrieve operating cash flow for Nvidia",
    "Retrieve earnings for tickers on fiscal date '2022-12-31'",
    "Get capital expenditures > -2 million",
    "Retrieve tickers with fiscal year & cash dividends paid (not null)",
    "Retrieve stock tickers with free cash flow > 50,000,000",
    "Retrieve fiscal year & operating cash flow < 10,000,000",
    "Retrieve stock ticker, fiscal year, & capital expenditures (negative)",
  ];

  const fetchData = async () => {
    setLoading(true);
  
    try {
      const response = await fetch(`http://localhost:8000/read.php?table=${selectedTable}`);
      const result = await response.json();
  
      if (result.data) {
        setData(result.data);
        setFilteredData(result.data);
        setColumns(result.columns || []);
        setFormData({}); // Reset form data
        setPrimaryKey(result.primaryKey); // Set the primary key dynamically
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTable]);

  useEffect(() => {
    if (!filterText) {
      setFilteredData(data);
    } else {
      const lowerCaseFilter = filterText.toLowerCase();
      setFilteredData(
        data.filter((row) =>
          Object.values(row).some((value) =>
            value?.toString().toLowerCase().includes(lowerCaseFilter)
          )
        )
      );
    }
  }, [filterText, data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(`http://localhost:8000/create.php?table=${selectedTable}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      alert(result.message || result.error);
      setView("read");
      fetchData();
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8000/update.php?table=${selectedTable}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          [primaryKey]: formData[primaryKey], // Ensure the primary key is included
        }),
      });
  
      const result = await response.json();
      alert(result.message || result.error);
      setView("read");
      fetchData();
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };
  
  const handleDelete = async () => {
    if (!deleteId) {
      alert("Please enter an ID to delete.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/delete.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: selectedTable,
          id: deleteId, // Primary key value
        }),
      });

      const result = await response.json();
      alert(result.message || result.error);
      setDeleteId(""); // Clear input field
      fetchData(); // Refresh the table after deletion
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const handleRunQuery = async () => {
    try {
      const response = await fetch(`http://localhost:8000/reports.php?query=${selectedQuery}`);
      const result = await response.json();
      if (result.data) {
        setQueryResults(result.data);
      } else {
        alert(result.error || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching query results:", error);
    }
  };


  return (
    <div>
      <h1>Financial Data Manager</h1>
      <div  style={{ marginBottom: "20px" }} >
        <label>Select Table: </label>
        <select
          value={selectedTable}
          onChange={(e) => {
            setSelectedTable(e.target.value); // Change table
            setView("read"); // Reset view
          }}
        >
          <option value="Company">Company</option>
          <option value="Stock">Stock</option>
          <option value="Income_Statement">Income Statement</option>
          <option value="Balance_Sheet">Balance Sheet</option>
          <option value="Cash_Flow">Cash Flow</option>
          <option value="Earnings">Earnings</option>
        </select>
      </div>
  
      {view === "read" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <button
              onClick={() => {
                setFormData({});
                setView("create");
              }}
              style={{ marginRight: "10px" }}
            >
              Create New Record
            </button>
            <input
              type="text"
              placeholder="Search records"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
          {loading ? (
            <p>Loading {selectedTable} records...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={row[primaryKey] || `row-${index}`}>
                    {columns.map((column) => (
                      <td key={`${column}-${index}`}>{row[column]}</td>
                    ))}
                    <td>
                      <button
                        onClick={() => {
                          setFormData(row);
                          setView("edit");
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{ marginTop: "10px", display: "flex" }}>
            <input
              type="text"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
              placeholder="Enter primary key to delete record"
              style={{ marginRight: "10px", flex: 1 }}
            />
            <button onClick={handleDelete}>Delete</button>
          </div>

          {/* Reports Section */}
          <div style={{ marginTop: "40px" }}>
            <h2>Reports</h2>
            <div>
              <label>Select a Query: </label>
              <select
                value={selectedQuery}
                onChange={(e) => setSelectedQuery(e.target.value)}
              >
                <option value="">--</option>
                {queries.map((query, index) => (
                  <option key={index} value={index + 1}>
                    {query}
                  </option>
                ))}
              </select>
              <button
                onClick={handleRunQuery}
                style={{ fontSize: "12px", marginLeft: "10px" }} // Smaller font for button
              >
                Run Query
              </button>
            </div>
            {queryResults.length > 0 && (
              <div>
                <h3>Query Results</h3>
                <table>
                  <thead>
                    <tr>
                      {Object.keys(queryResults[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResults.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, i) => (
                          <td key={i}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {view === "create" && (
        <div>
          <h2>Create Record in {selectedTable}</h2>
          {columns.map((column) => (
            <div key={column}>
              <label>{column}: </label>
              <input
                name={column}
                value={formData[column] || ""}
                onChange={handleInputChange}
                disabled={
                  column === primaryKey && !["Company", "Stock"].includes(selectedTable)
                } // Disable primary key unless it's a table where it's allowed
              />
            </div>
          ))}
          <button onClick={handleCreate}>Submit</button>
          <button onClick={() => setView("read")}>Cancel</button>
        </div>
      )}

      {view === "edit" && (
        <div>
          <h2>Edit Record in {selectedTable}</h2>
          {columns.map((column) => (
            <div key={column}>
              <label>{column}: </label>
              <input
                name={column}
                value={formData[column] || ""}
                onChange={handleInputChange}
                disabled={column === primaryKey} // Disable primary key
              />
            </div>
          ))}
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setView("read")}>Cancel</button>
        </div>
      )}
    </div>
  );
  
  
};

export default App;
