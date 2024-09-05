import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { example_backend } from 'declarations/example_backend';
import { Navigate } from 'react-router-dom';
import StaffFooter from './StaffFooter';

// Function to convert file to base64
const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Base64 Upload Adapter
const uploadAdapter = (loader) => {
  return {
    upload: async () => {
      const file = await loader.file;
      const base64 = await getBase64(file);
      return {
        default: base64,
      };
    },
  };
};

// Custom Plugin to add the upload adapter
function uploadPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return uploadAdapter(loader);
  };
}

const NewHouse = ({ userId }) => {
  const [apartments, setApartments] = useState([]);
  const [apartment, setApartmentss] = useState({
    id: '',
    name: '',
    address: '',
    owner: '',
    phone: '',
    price: '',
    description: '',
    image: null,
    status: 'Available',
  });
  const [staffId, setStaffId] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(true);

  const canisterId = process.env.CANISTER_ID_EXAMPLE_FRONTEND;
  const home = `/?canisterId=${canisterId}`;

  const validateForm = () => {
    if (!apartment.name || !apartment.address || !apartment.phone || !apartment.price || !apartment.image) {
      setError('Please fill all required fields and upload a valid image.');
      setIsValid(false);
      return false;
    }
    setError(null);
    setIsValid(true);
    return true;
  };

  const saveHouse = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    let id = apartments.length;

    try {
      await example_backend.addHouse(
        id,
        apartment.name,
        apartment.address,
        staffId,
        apartment.phone,
        apartment.price,
        apartment.description,
        apartment.image,
        apartment.status,
        staffId
      );
      setApartmentss({
        id: '',
        name: '',
        address: '',
        owner: '',
        phone: '',
        price: '',
        description: '',
        image: null,
        status: '',
      });
      setRedirect(true);
    } catch (error) {
      console.error("Failed to add House:", error);
    }
  };

  const getHouse = async () => {
    try {
      const houses = await example_backend.getHouse();
      setApartments(houses);
    } catch (error) {
      console.error("Failed to fetch Houses:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setApartmentss({ ...apartment, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the file is an image
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (validImageTypes.includes(file.type)) {
        getBase64(file).then((base64) => {
          setApartmentss({ ...apartment, image: base64 });
          setError(null);  // Clear any previous error
          setIsValid(true);  // Ensure the form is valid if an image is successfully loaded
        }).catch(error => console.error('Error converting file to base64:', error));
      } else {
        setError('Please upload a valid image file (JPEG, PNG, GIF).');
        setIsValid(false);
      }
    }
  };

  useEffect(() => {
    getHouse();

    const fetchPrincipal = async () => {
      const staffInfo = await example_backend.getStaffByNid(userId);
      if (staffInfo.length > 0) {
        setStaffId(staffInfo[0].staffId);
      } else {
        console.error("Failed to fetch staff info:", staffInfo);
      }
    };

    fetchPrincipal();
  }, [userId]);

  useEffect(() => {
    if (staffId) {
      setApartmentss({ ...apartment, owner: staffId });
    }
  }, [staffId]);

  if (redirect) {
    return <Navigate to="/house-list" />;
  }

  return (
    <>
      <h4 className='text-center'>New Apartment</h4>
      <div className="row mt-2 mb-5">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <div className="card-title text-center"><h5> </h5></div>
              <form onSubmit={saveHouse}>
                <input type="hidden" name="owner" value={staffId} />
                <div className="form-group mb-2">
                  <label htmlFor="name">Apartment name:</label>
                  <input
                    type="text"
                    id='name'
                    className="form-control"
                    name='name'
                    required
                    value={apartment.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="location">Location:</label>
                  <input
                    type="text"
                    id='location'
                    className="form-control"
                    name='address'
                    required
                    value={apartment.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="ownername">Owner's System Id:</label>
                  <input
                    type="text"
                    id='ownername'
                    readOnly
                    className="form-control"
                    name='owner'
                    required
                    value={staffId}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="phone">Your phone number:</label>
                  <input
                    type="text"
                    id='phone'
                    className="form-control"
                    name='phone'
                    required
                    value={apartment.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="price">Price per day:</label>
                  <input
                    type="number"
                    id='price'
                    className="form-control"
                    name='price'
                    required
                    value={apartment.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="photo">Photo:</label>
                  <input
                    type="file"
                    id='photo'
                    className="form-control"
                    name='image'
                    required
                    onChange={handleFileChange}
                  />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="form-group mb-2">
                  <label htmlFor="description">Description:</label>
                  <CKEditor
                    editor={ClassicEditor}
                    config={{
                      extraPlugins: [uploadPlugin],
                    }}
                    data={apartment.description}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setApartmentss({ ...apartment, description: data });
                    }}
                  />
                </div>
                <button 
                  type="submit" 
                  className='btn btn-success shadow' 
                  disabled={!isValid}
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6"></div>
      </div>
      <StaffFooter />
    </>
  );
}

export default NewHouse;
