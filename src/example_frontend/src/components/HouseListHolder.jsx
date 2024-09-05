import React, { useEffect, useState } from 'react';
import { example_backend } from 'declarations/example_backend';
// staff footer
import StaffFooter from './StaffFooter';

function HouseListHolder({ userId, userInfo }) {
  const [houses, setHouses] = useState([]);
  const [editPrice, setEditPrice] = useState({}); // State to hold new prices
  const [alert, setAlert] = useState({}); // State to hold alert messages and visibility

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
    setEditPrice((prevState) => ({
      ...prevState,
      [id]: newPrice,
    }));
  };

  const handleUpdatePrice = async (id) => {
    const newPrice = editPrice[id];
    try {
      const success = await example_backend.updateApartmentPrice(id, newPrice);
      if (success) {
        setHouses((prevState) =>
          prevState.map((house) =>
            house.id === id ? { ...house, price: newPrice } : house
          )
        );
        setAlert((prevState) => ({
          ...prevState,
          [id]: { message: 'Price updated successfully!', visible: true },
        }));
        // Hide alert after 5 seconds
        setTimeout(() => {
          setAlert((prevState) => ({
            ...prevState,
            [id]: { ...prevState[id], visible: false },
          }));
        }, 5000);
      } else {
        console.error('Error updating price: Apartment not found');
        setAlert((prevState) => ({
          ...prevState,
          [id]: {
            message: 'Error updating price: Apartment not found',
            visible: true,
          },
        }));
        setTimeout(() => {
          setAlert((prevState) => ({
            ...prevState,
            [id]: { ...prevState[id], visible: false },
          }));
        }, 5000);
      }
    } catch (error) {
      console.error('Error updating price:', error);
      setAlert((prevState) => ({
        ...prevState,
        [id]: { message: 'Error updating price.', visible: true },
      }));
      setTimeout(() => {
        setAlert((prevState) => ({
          ...prevState,
          [id]: { ...prevState[id], visible: false },
        }));
      }, 5000);
    }
  };

  const handleDeleteHouse = async (id) => {
    try {
      const success = await example_backend.deleteHouse(id);
      if (success) {
        setHouses((prevState) => prevState.filter((house) => house.id !== id));
        setAlert((prevState) => ({
          ...prevState,
          [id]: { message: 'House deleted successfully!', visible: true },
        }));
        // Hide alert after 5 seconds
        setTimeout(() => {
          setAlert((prevState) => ({
            ...prevState,
            [id]: { ...prevState[id], visible: false },
          }));
        }, 5000);
      } else {
        console.error('Error deleting house: Apartment not found');
        setAlert((prevState) => ({
          ...prevState,
          [id]: { message: 'Error deleting house: Apartment not found', visible: true },
        }));
        setTimeout(() => {
          setAlert((prevState) => ({
            ...prevState,
            [id]: { ...prevState[id], visible: false },
          }));
        }, 5000);
      }
    } catch (error) {
      console.error('Error deleting house:', error);
      setAlert((prevState) => ({
        ...prevState,
        [id]: { message: 'Error deleting house.', visible: true },
      }));
      setTimeout(() => {
        setAlert((prevState) => ({
          ...prevState,
          [id]: { ...prevState[id], visible: false },
        }));
      }, 5000);
    }
  };

  return (
    <>
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

                {/* Button to delete the house */}
                <button
                  className="btn btn-danger mt-2 ml-2"
                  onClick={() => handleDeleteHouse(house.id)}
                >
                  Delete House
                </button>

                {/* Display alert message on the card */}
                {alert[house.id] && alert[house.id].visible && (
                  <div className="alert alert-info mt-2" role="alert">
                    {alert[house.id].message}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <StaffFooter />
    </>
  );
}

export default HouseListHolder;
