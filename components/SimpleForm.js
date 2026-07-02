'use client';

import { useState } from 'react';
import { submitIntake } from '../app/actions';

export default function SimpleForm({ title = 'Start screening', subtitle = 'Tell DzeNhare what you are trying to build and where you need control.' }) {
  const [status, setStatus] = useState({ type: '', message: '' });
  const [pending, setPending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setStatus({ type: '', message: '' });

    const formData = new FormData(event.currentTarget);
    const result = await submitIntake(formData);

    setStatus({
      type: result.ok ? 'success' : 'error',
      message: result.message,
    });

    if (result.ok) {
      event.currentTarget.reset();
    }

    setPending(false);
  }

  return (
    <div className="card">
      <div className="label-row">
        <span className="tag">Project Intake</span>
        <span className="tag green">Working Prototype</span>
      </div>
      <h3>{title}</h3>
      <p style={{ marginBottom: 18 }}>{subtitle}</p>
      <form style={{ display: 'grid', gap: 12 }} onSubmit={handleSubmit}>
        <input className="bot-field" type="text" name="company_website" tabIndex="-1" autoComplete="off" aria-hidden="true" />
        <input className="field" type="text" name="name" placeholder="Your name" />
        <input className="field" type="email" name="email" placeholder="Email address" />
        <select className="field" name="role" defaultValue="">
          <option value="" disabled>I am a...</option>
          <option>Diaspora builder</option>
          <option>Contractor</option>
          <option>Supplier</option>
          <option>Partner</option>
        </select>
        <textarea className="field" name="details" rows="4" placeholder="What are you trying to build, fix, or verify?"></textarea>
        <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? 'Submitting...' : 'Submit intake'}</button>
      </form>
      {status.message ? (
        <div className={`form-status ${status.type === 'success' ? 'success' : 'error'}`}>
          {status.message}
        </div>
      ) : null}
    </div>
  );
}
