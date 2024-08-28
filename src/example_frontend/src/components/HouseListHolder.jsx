import React, { useEffect, useState } from 'react';
import { example_backend } from 'declarations/example_backend';

function HouseListHolder({ userId, userInfo }) {
  const [houses, setHouses] = useState([]);
  const [editPrice, setEditPrice] = useState({}); // State to hold new prices

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

  const handlePriceChange = (id, newPrice) => {
    setEditPrice(prevState => ({
      ...prevState,
      [id]: newPrice
    }));
  };

  const handleUpdatePrice = async (id) => {
    const newPrice = editPrice[id];
    try {
      const success = await example_backend.updateApartmentPrice(id, newPrice);
      if (success) {
        setHouses(prevState =>
          prevState.map(house =>
            house.id === id ? { ...house, price: newPrice } : house
          )
        );
      } else {
        console.error('Error updating price: Apartment not found');
      }
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

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
                <p className="card-text"><strong>Price:</strong> {house.price}</p>
                <p className="card-text"><strong>Status:</strong> {house.status}</p>
                <p className="card-text"><strong>Owner:</strong> {house.owner}</p>
                
                {/* Input field to edit price */}
                <div className="form-group">
                  <label htmlFor={`price-${house.id}`}>New Price:</label>
                  <input
                    type="text"
                    id={`price-${house.id}`}
                    className="form-control"
                    value={editPrice[house.id] || ''}
                    onChange={(e) => handlePriceChange(house.id, e.target.value)}
                  />
                </div>

                {/* Button to submit the new price */}
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => handleUpdatePrice(house.id)}
                >
                  Update Price
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HouseListHolder;
