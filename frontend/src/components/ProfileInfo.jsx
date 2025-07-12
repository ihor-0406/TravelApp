import React from 'react';

export default function ProfileInfo({ profile }) {
  return (
    <dl className="row">
      <dt className="col-sm-3">Name</dt>
      <dd className="col-sm-9">{profile.firstName} {profile.lastName}</dd>
      <dt className="col-sm-3">Email</dt>
      <dd className="col-sm-9">{profile.email}</dd>
      <dt className="col-sm-3">Phone</dt>
      <dd className="col-sm-9">{profile.phone || '—'}</dd>
      <dt className="col-sm-3">Birth Date</dt>
      <dd className="col-sm-9">{profile.dateOfBirth || '—'}</dd>
      <dt className="col-sm-3">Gender</dt>
      <dd className="col-sm-9">{profile.gender || '—'}</dd>
      <dt className="col-sm-3">Address</dt>
      <dd className="col-sm-9">
        {profile.address
          ? `${profile.address.street}, ${profile.address.city}, ${profile.address.postalCode}, ${profile.address.country}`
          : '—'}
      </dd>
    </dl>
  );
}