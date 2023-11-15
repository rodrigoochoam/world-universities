import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';

function App() {
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalUniversitiesCount, setTotalUniversitiesCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await axios(
          'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json'
        );
        setUniversities(result.data);
        const uniqueCountries = [...new Set(result.data.map((uni) => uni.country))];
        setCountries(uniqueCountries);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered;
      if (selectedCountry) {
        filtered = universities.filter((uni) => uni.country === selectedCountry);
      } else {
        filtered = universities;
      }

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = perPage === 'all' ? filtered.length : startIndex + perPage;
    setFilteredUniversities(filtered.slice(startIndex, endIndex));

    // Set the total count for the selected country
    setTotalUniversitiesCount(filtered.length);

  }, [universities, selectedCountry, currentPage, perPage]);

  return (
    <Container>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <Form.Group>
          <Form.Label>Select Country:</Form.Label>
          <Form.Control
            as="select"
            value={selectedCountry}
            onChange={(event) => setSelectedCountry(event.target.value)}
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Select Items Per Page:</Form.Label>
          <Form.Control
            as="select"
            value={perPage}
            onChange={(event) => setPerPage(event.target.value)}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value="all">Show All</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" onClick={() => setCurrentPage(1)}>
          Apply Filters
        </Button>
        {/* Number of univiersities found for this country and filtered: */}
        <p>Total # of universities found for {selectedCountry}: {totalUniversitiesCount}</p>
      </Form>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul className="list-group">
          {filteredUniversities.map((uni) => (
            <li className="list-group-item" key={uni.name}>
              <strong>Name:</strong> {uni.name} | <strong>Country:</strong> {uni.country} |{' '}
              <strong>Domains:</strong> {uni.domains.join(', ')}
            </li>
          ))}
        </ul>
      )}

      <div>
        <Button
          variant="secondary"
          onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>{' '}
        <Button
          variant="secondary"
          onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
          disabled={currentPage * perPage >= universities.length}
        >
          Next
        </Button>
      </div>
      <div>
        <p>This information was retrieved from <a href="https://github.com/Hipo/university-domains-list/tree/master" target="_blank">University Domains and Names Data List</a>. Website created by Rodrigo Ochoa Mayagoitia at MIT Full-Stack Software Engineering Certificate with MERN. 14-November-2023 </p>
      </div>
    </Container>
  );
}

export default App;
