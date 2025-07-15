import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState([]);
  const [tours, setTours] = useState([]);
  const [form, setForm] = useState({
    value: '',
    startDate: '',
    endDate: '',
    description: '',
    tourId: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDiscounts();
    fetchTours();
  }, []);

  const fetchDiscounts = () => {
    axios.get('/api/admin/discounts')
      .then(res => setDiscounts(res.data))
      .catch(err => console.error('Error loading discounts', err));
  };

  const fetchTours = () => {
    axios.get('/api/tours')
      .then(res => setTours(res.data))
      .catch(err => console.error('Error loading tours', err));
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, value: parseFloat(form.value) };

    const request = editingId
      ? axios.put(`/api/admin/discounts/${editingId}`, payload)
      : axios.post('/api/admin/discounts', payload);

    request.then(() => {
      fetchDiscounts();
      resetForm();
    }).catch(err => console.error('Error saving discount', err));
  };

  const handleEdit = (discount) => {
    setForm({
      value: discount.value,
      startDate: discount.startDate,
      endDate: discount.endDate,
      description: discount.description,
      tourId: discount.tourId,
    });
    setEditingId(discount.id);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this discount?')) return;

    axios.delete(`/api/admin/discounts/${id}`)
      .then(() => fetchDiscounts())
      .catch(err => console.error( err));
  };

  const resetForm = () => {
    setForm({
      value: '',
      startDate: '',
      endDate: '',
      description: '',
      tourId: '',
    });
    setEditingId(null);
  };

  return (
    <div className="container mt-4">
      <h4>{editingId ? 'Edit Discount' : 'Add Discount'}</h4>
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-2">
          <input type="number" step="0.01" className="form-control" name="value" value={form.value} onChange={handleChange} placeholder="Value %" required />
        </div>
        <div className="col-md-2">
          <input type="date" className="form-control" name="startDate" value={form.startDate} onChange={handleChange} required />
        </div>
        <div className="col-md-2">
          <input type="date" className="form-control" name="endDate" value={form.endDate} onChange={handleChange} required />
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
        </div>
        <div className="col-md-2">
          <select className="form-select" name="tourId" value={form.tourId} onChange={handleChange} required>
            <option value="">Select Tour</option>
            {tours.map(tour => (
              <option key={tour.id} value={tour.id}>{tour.title}</option>
            ))}
          </select>
        </div>
        <div className="col-md-1">
          <button type="submit" className="btn btn-primary w-100">{editingId ? 'Update' : 'Add'}</button>
        </div>
      </form>

      <h5>Existing Discounts</h5>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Tour</th>
            <th>Value (%)</th>
            <th>Start</th>
            <th>End</th>
            <th>Description</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map(d => {
            const tour = tours.find(t => t.id === d.tourId);
            return (
              <tr key={d.id}>
                <td>{tour ? tour.title : d.tourId}</td>
                <td>{d.value}</td>
                <td>{d.startDate}</td>
                <td>{d.endDate}</td>
                <td>{d.description}</td>
                <td>
                  <button className="btn btn-sm btn-warning" onClick={() => handleEdit(d)}>Edit</button>
                </td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(d.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
