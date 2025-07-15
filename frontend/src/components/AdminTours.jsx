import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const DIFFICULTY_OPTIONS = ['EASY', 'MEDIUM', 'HARD'];
const TYPE_OPTIONS = ['EXTREME', 'BEACH', 'CULTURAL', 'NATURAL', 'FAMILY', 'ADVENTURE'];

export default function AdminTours() {
  const [tours, setTours] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    location: '',
    duration: '',
    difficulty: '',
    type: '',
    imageUrl: '',
    imageUrls: ['']
  });

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = () => {
    axios.get('/api/tours')
      .then(res => {
        console.log("Ответ сервера:", res.data);
        const data = res.data;
        const toursArray = Array.isArray(data)
          ? data
          : Array.isArray(data.content)
          ? data.content
          : [];

        if (!Array.isArray(toursArray)) {
          console.warn("Неправильный формат данных:", data);
          setTours([]);
        } else {
          setTours(toursArray);
        }
      })
      .catch(err => {
        console.error("Ошибка загрузки туров:", err);
        setTours([]);
      });
  };

  const handleImageUrlChange = (index, value) => {
    const updatedUrls = [...formData.imageUrls];
    updatedUrls[index] = value;
    setFormData({ ...formData, imageUrls: updatedUrls });
  };

  const addImageField = () => {
    setFormData({ ...formData, imageUrls: [...formData.imageUrls, ''] });
  };

  const removeImageField = (index) => {
    const updatedUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, imageUrls: updatedUrls });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this tour?')) return;
    axios.delete(`/api/tours/admin/${id}`)
      .then(fetchTours)
      .catch(err => console.error('Ошибка при удалении:', err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      title, price, description, location,
      duration, difficulty, type, imageUrl, imageUrls
    } = formData;

    if (!title || !price || !description || !location || !duration || !difficulty || !type || !imageUrl) {
      alert('Заполните все обязательные поля!');
      return;
    }

    const payload = {
      title, price, description, location,
      duration, difficulty, type, imageUrl,
      imageUrls: imageUrls.filter(url => url.trim() !== '')
    };

    const method = editId ? 'put' : 'post';
    const url = editId ? `/api/tours/admin/${editId}` : '/api/tours/admin';

    axios({ method, url, data: payload })
      .then(() => {
        fetchTours();
        resetForm();
      })
      .catch(err => console.error('Ошибка при сохранении тура:', err));
  };

  const handleEdit = (tour) => {
    setEditId(tour.id);
    setFormData({
      title: tour.title || '',
      price: tour.price || '',
      description: tour.description || '',
      location: tour.location || '',
      duration: tour.duration || '',
      difficulty: tour.difficulty || '',
      type: tour.type || '',
      imageUrl: tour.imageUrl || '',
      imageUrls: tour.imageUrls || ['']
    });
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      title: '',
      price: '',
      description: '',
      location: '',
      duration: '',
      difficulty: '',
      type: '',
      imageUrl: '',
      imageUrls: ['']
    });
  };

  return (
    <div className="container my-4">
      <div className="bg-light p-4 rounded shadow-sm mb-4">
        <h4>{editId ? 'Edit Tour' : 'Create New Tour'}</h4>
        <form onSubmit={handleSubmit} className="row g-2">
          <div className="col-md-4">
            <input type="text" placeholder="Title" className="form-control" value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="col-md-2">
            <input type="number" placeholder="Price (€)" className="form-control" value={formData.price}
              onChange={e => setFormData({ ...formData, price: e.target.value })} required />
          </div>
          <div className="col-md-2">
            <input type="text" placeholder="Duration" className="form-control" value={formData.duration}
              onChange={e => setFormData({ ...formData, duration: e.target.value })} required />
          </div>
          <div className="col-md-2">
            <select className="form-select" value={formData.difficulty}
              onChange={e => setFormData({ ...formData, difficulty: e.target.value })} required>
              <option value="">Difficulty</option>
              {DIFFICULTY_OPTIONS.map(diff => <option key={diff} value={diff}>{diff}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })} required>
              <option value="">Type</option>
              {TYPE_OPTIONS.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <input type="text" placeholder="Location" className="form-control" value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })} required />
          </div>
          <div className="col-md-6">
            <textarea className="form-control" placeholder="Description" rows={2} value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })} required />
          </div>
          <div className="col-md-12">
            <input type="text" placeholder="Main Image URL" className="form-control" value={formData.imageUrl}
              onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} required />
          </div>
          <div className="col-md-12">
            <label className="form-label fw-semibold">Album (additional image URLs)</label>
            {formData.imageUrls.map((url, idx) => (
              <div key={idx} className="input-group mb-2">
                <input type="text" className="form-control" placeholder={`Image URL ${idx + 1}`}
                  value={url} onChange={(e) => handleImageUrlChange(idx, e.target.value)} />
                <button type="button" className="btn btn-outline-danger" onClick={() => removeImageField(idx)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={addImageField}>
              <FontAwesomeIcon icon={faPlus} /> Add Image
            </button>
          </div>
          <div className="col-md-12 d-flex gap-2">
            <button className="btn btn-success" type="submit">
              <FontAwesomeIcon icon={faPlus} /> {editId ? 'Update' : 'Create'}
            </button>
            {editId && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h5 className="mb-3">All Tours</h5>
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Type</th>
            <th>Difficulty</th>
            <th>Duration</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center text-muted">No tours found</td>
            </tr>
          ) : (
            tours.map(t => (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{t.price}</td>
                <td>{t.type}</td>
                <td>{t.difficulty}</td>
                <td>{t.duration}</td>
                <td>{t.location}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(t)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
