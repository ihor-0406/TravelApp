import React from 'react';

export default function ProfileSettings({ profile, formData, handleChange, handleSave, saving, handleAvatarSelect, handleAvatarUpload, uploading }) {
  return (
    <div className="card p-4">
      <div className="d-flex align-items-center mb-4">
        <img
          src={profile.avatarUrl || 'https://via.placeholder.com/100'}
          alt="avatar"
          className="rounded-circle me-3"
          style={{ width: 100, height: 100, objectFit: 'cover' }}
        />
        <div>
          <label className="form-label">Change Avatar</label>
          <input
            type="file"
            accept="image/*"
            className="form-control form-control-sm mb-2"
            onChange={handleAvatarSelect}
          />
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleAvatarUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading…' : 'Upload Avatar'}
          </button>
        </div>
      </div>

      {[
        { label: 'First Name', name: 'firstName' },
        { label: 'Last Name', name: 'lastName' },
        { label: 'Phone', name: 'phone' },
        { label: 'Birth Date', name: 'dateOfBirth', type: 'date' }
      ].map(({ label, name, type }) => (
        <div className="mb-3" key={name}>
          <label className="form-label">{label}</label>
          <input
            name={name}
            type={type || 'text'}
            className="form-control"
            value={formData[name] || ''}
            onChange={handleChange}
          />
        </div>
      ))}

      <div className="mb-3">
        <label className="form-label">Gender</label>
        <select
          name="gender"
          className="form-select"
          value={formData.gender || ''}
          onChange={handleChange}
        >
          <option value="">Select…</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <h5 className="mt-4">Address</h5>
      {['street', 'city', 'postalCode', 'country'].map(field => (
        <div className="mb-3" key={field}>
          <label className="form-label">{field === 'postalCode' ? 'Postal Code' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <input
            name={`address.${field}`}
            className="form-control"
            value={formData.address?.[field] || ''}
            onChange={handleChange}
          />
        </div>
      ))}

      <button
        className="btn btn-primary mt-3"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  );
}
