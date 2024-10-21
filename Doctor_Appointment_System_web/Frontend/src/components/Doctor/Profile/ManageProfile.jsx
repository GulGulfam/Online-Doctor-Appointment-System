import React, { useState, useEffect } from 'react';
import './ManageProfile.css';
import Modal from './Modal';

const CreateProfile = () => {
  const [profile, setProfile] = useState(null);
  const [newProfile, setNewProfile] = useState({
    name: '',
    email: '',
    age: '',
    contact: '',
    gender: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          setNewProfile(data);
          setIsEditing(true);
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateProfile();
    } else {
      await createProfile();
    }
  };

  const validateContact = (contact) => {
    return /^\d{11}$/.test(contact);
  };

  const validateName = (name) => {
    return name.trim().length > 0;
  };

  const updateProfile = async () => {
    setError('');
    if (!newProfile.name || !newProfile.age || !newProfile.contact || !newProfile.gender) {
      setError('All fields are required');
      return;
    }
    if (!validateContact(newProfile.contact)) {
      setError('Contact number must be 11 digits long');
      return;
    }
    if (newProfile.age < 5 || newProfile.age > 80) {
      setError('Age must be between 5 and 80');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(newProfile),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Profile updated successfully');
        setProfile(data);
        setIsEditModalOpen(false);
      } else {
        const result = await response.json();
        setError(result.message || 'An error occurred while saving the profile');
      }
    } catch (error) {
      console.error('Save error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    setError('');
    if (!newProfile.name || !newProfile.email || !newProfile.age || !newProfile.contact || !newProfile.gender) {
      setError('All fields are required');
      return;
    }
    if (!validateContact(newProfile.contact)) {
      setError('Contact number must be 11 digits long');
      return;
    }
    if (newProfile.age < 5 || newProfile.age > 80) {
      setError('Age must be between 5 and 80');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(newProfile),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Profile created successfully');
        setProfile(data);
        setIsEditModalOpen(false);
      } else {
        const result = await response.json();
        setError(result.message || 'An error occurred while saving the profile');
      }
    } catch (error) {
      console.error('Save error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        alert('Profile deleted successfully');
        setProfile(null);
        setNewProfile({
          name: '',
          email: '',
          age: '',
          contact: '',
          gender: ''
        });
        setIsDeleteModalOpen(false);
      } else {
        const result = await response.json();
        setError(result.message || 'An error occurred while deleting the profile');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      {profile ? (
        <>
          <table className="profile-info">
            <thead>
              <tr>
                <th colSpan="2">Profile</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Name:</td>
                <td>{profile.name}</td>
              </tr>
              <tr>
                <td>Email:</td>
                <td>{profile.email}</td>
              </tr>
              <tr>
                <td>Age:</td>
                <td>{profile.age}</td>
              </tr>
              <tr>
                <td>Gender:</td>
                <td>{profile.gender}</td>
              </tr>
              <tr>
                <td>Contact:</td>
                <td>{profile.contact}</td>
              </tr>
            </tbody>
          </table>
          <div className="profile-actions">
            <button onClick={() => setIsEditModalOpen(true)}>Edit</button>
            <button onClick={() => setIsDeleteModalOpen(true)}>Delete</button>
          </div>

          {error && <p className="error">{error}</p>}

          <Modal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDelete}
            message="Are you sure you want to delete your profile?"
            confirmText="Yes"
            cancelText="No"
          />

          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onConfirm={handleSubmit} 
            message="Do you want to save changes?"
            confirmText="Save"
            cancelText="Cancel"
          >
            <form onSubmit={handleSubmit}>
              <label>Name:</label>
              <input
                type="text"
                value={newProfile.name}
                onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                required
              />

              <label>Age:</label>
              <input
                type="number"
                value={newProfile.age}
                onChange={(e) => setNewProfile({ ...newProfile, age: e.target.value })}
                required
              />

              <label>Gender:</label>
              <select
                value={newProfile.gender}
                onChange={(e) => setNewProfile({ ...newProfile, gender: e.target.value })}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <label>Contact:</label>
              <input
                type="text"
                value={newProfile.contact}
                onChange={(e) => setNewProfile({ ...newProfile, contact: e.target.value })}
                pattern="\d{11}"
                title="Contact number must be 11 digits long"
                required
              />

              {error && <p className="error">{error}</p>}
            </form>
          </Modal>
        </>
      ) : (
        <div className="create-profile-container">
          <h2>Create Profile</h2>
          <form onSubmit={createProfile}>
            <label>Name:</label>
            <input
              type="text"
              value={newProfile.name}
              onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
              required
            />

            <label>Email:</label>
            <input
              type="email"
              value={newProfile.email}
              onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })}
              required
            />

            <label>Age:</label>
            <input
              type="number"
              value={newProfile.age}
              onChange={(e) => setNewProfile({ ...newProfile, age: e.target.value })}
              required
            />

            <label>Gender:</label>
            <select
              value={newProfile.gender}
              onChange={(e) => setNewProfile({ ...newProfile, gender: e.target.value })}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label>Contact:</label>
            <input
              type="text"
              value={newProfile.contact}
              onChange={(e) => setNewProfile({ ...newProfile, contact: e.target.value })}
              pattern="\d{11}"
              title="Contact number must be 11 digits long"
              required
            />

            {error && <p className="error">{error}</p>}
            <button type="submit">Create Profile</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateProfile;
