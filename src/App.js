import React, { useState } from 'react';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner'; // Importing the loader

const App = () => {
  const [pincode, setPincode] = useState('');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const handleFetchData = async () => {
    if (pincode.length !== 6) {
      setError('Please enter a valid 6-digit postal code.');
      return;
    }

    setLoading(true);
    setError('');
    setData([]);
    setFilteredData([]);

    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const result = response.data[0];

      if (result.Status === 'Success') {
        setData(result.PostOffice);
        setFilteredData(result.PostOffice);
      } else {
        setError('Invalid Pincode or no data found.');
      }
    } catch (err) {
      setError('Error fetching data, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const filterValue = e.target.value.toLowerCase();
    setFilter(filterValue);

    const filtered = data.filter((postOffice) =>
      postOffice.Name.toLowerCase().includes(filterValue)
    );

    setFilteredData(filtered);

    if (filtered.length === 0) {
      setError("Couldn’t find the postal data you’re looking for...");
    } else {
      setError('');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Pincode Lookup</h1>
      <input
        type="text"
        placeholder="Enter 6-digit Pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
        style={{ padding: '10px', fontSize: '16px', marginBottom: '10px' }}
      />
      <button
        onClick={handleFetchData}
        style={{
          padding: '10px 20px',
          marginLeft: '10px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Lookup
      </button>

      {loading && (
        <div style={{ marginTop: '20px' }}>
          <ThreeDots height="80" width="80" color="blue" ariaLabel="loading" />
        </div>
      )}

      {error && (
        <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>
      )}

      {filteredData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Filter by Post Office Name"
            value={filter}
            onChange={handleFilterChange}
            style={{ padding: '10px', fontSize: '16px', marginBottom: '10px' }}
          />

          <table border="1" style={{ margin: '20px auto', width: '80%', textAlign: 'left' }}>
            <thead>
              <tr>
                <th>Post Office Name</th>
                <th>Pincode</th>
                <th>District</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((postOffice, index) => (
                <tr key={index}>
                  <td>{postOffice.Name}</td>
                  <td>{postOffice.Pincode}</td>
                  <td>{postOffice.District}</td>
                  <td>{postOffice.State}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
