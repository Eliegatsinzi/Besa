import React, { useEffect, useState } from 'react';
import { example_backend } from 'declarations/example_backend';

function HouseListHolder() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const houseList = await example_backend.getHouse();
        setHouses(houseList);
      } catch (error) {
        console.error('Error fetching houses:', error);
      }
    };

    fetchHouses();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center">House List</h2>
      <div className="row">
        {houses.map((house, index) => (
          <div className="col-md-4" key={index}>
            <div className="card mb-4">
              <img src={house.image} className="card-img-top" alt={house.name} />
              <div className="card-body">
                <h5 className="card-title">{house.name}</h5>
                <p className="card-text">{house.description}</p>
                <p className="card-text"><strong>Price:</strong> {house.price}</p>
                <p className="card-text"><strong>Status:</strong> {house.status}</p>
                <p className="card-text"><strong>Owner:</strong> {house.owner}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HouseListHolder;
