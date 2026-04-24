import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createBooking } from '../api/bookingApi';
import { addLocalNotification } from '../../M4/services/localNotifications';
import './BookingForm.css';

function Field({ label, icon, name, type = 'text', value, onChange, locked }) {
  return (
    <div className="form-field">
      <label>
        {icon && <span className="field-icon">{icon}</span>}
        {label}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange} required
        readOnly={locked} className={locked ? 'locked' : ''}
      />
      {locked && <span className="locked-hint">Auto-filled</span>}
    </div>
  );
}

function BookingForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlResourceId   = searchParams.get('resourceId')   || '';
  const urlResourceName = searchParams.get('resourceName') || '';
  const urlUserId       = searchParams.get('userId')       || '';
  const urlUserEmail    = searchParams.get('userEmail')    || '';
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  const [form, setForm] = useState({
    userId:      urlUserId    || user?.id    || '',
    resourceId:  urlResourceId,
    bookingDate: '',
    startTime:   '',
    endTime:     '',
    userEmail:   urlUserEmail || user?.email || '',
    purpose:     '',
    attendees:   '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setForm(f => ({
      ...f,
      resourceId: urlResourceId || f.resourceId,
      userId:     urlUserId     || f.userId,
      userEmail:  urlUserEmail  || f.userEmail,
    }));
  }, [urlResourceId, urlUserId, urlUserEmail]);

  const handleChange = e => {
    const { name, value } = e.target;
    if ((name === 'resourceId' && urlResourceId) ||
        (name === 'userId'     && (urlUserId || user?.id)) ||
        (name === 'userEmail'  && (urlUserEmail || user?.email))) return;
    setForm(f => ({ ...f, [name]: value }));
  };

  const parseBackendError = (err) => {
    const resp   = err?.response;
    const status = resp?.status;
    const data   = resp?.data;
    const rawMsg = data?.message || data?.error || data?.detail || err?.message || 'An unexpected error occurred';

    const isConflict   = status === 409 || rawMsg?.toLowerCase().includes('conflict') || rawMsg?.toLowerCase().includes('already booked') || rawMsg?.toLowerCase().includes('overlapping');
    const isValidation = status === 400 || rawMsg?.toLowerCase().includes('invalid')  || rawMsg?.toLowerCase().includes('required');
    const isServer     = status >= 500  || rawMsg?.toLowerCase().includes('internal server');

    if (isConflict) return {
      type: 'conflict',
      title: 'Time Slot Already Booked',
      detail: `Resource ${form.resourceId} is not available on ${form.bookingDate} from ${form.startTime} to ${form.endTime}.`,
      tips: [
        'Try a different start or end time',
        'Check another date for availability',
        'Choose a different resource from the catalogue',
      ],
    };

    if (isValidation) return {
      type: 'validation',
      title: 'Invalid Booking Details',
      detail: rawMsg,
      tips: [
        'Make sure all required fields are filled',
        'End time must be after start time',
        'Number of attendees must be greater than 0',
      ],
    };

    if (isServer) return {
      type: 'server',
      title: 'Server Error',
      detail: 'The server encountered an unexpected error. This is not your fault.',
      tips: [
        'Wait a moment and try again',
        'Check that the backend server is running',
        `Status: ${status || 'unknown'} — ${rawMsg}`,
      ],
    };

    return {
      type: 'error',
      title: 'Booking Failed',
      detail: rawMsg,
      tips: ['Please check your details and try again'],
    };
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createBooking({
        ...form,
        userId:     Number(form.userId),
        resourceId: Number(form.resourceId),
        attendees:  Number(form.attendees),
      });
      addLocalNotification(
        'BOOKING_CREATED',
        'Booking Submitted',
        `New booking for Resource ${form.resourceId} on ${form.bookingDate} from ${form.startTime} to ${form.endTime}. Awaiting approval.`
      );
      navigate('/my-bookings');
    } catch (err) {
      setError(parseBackendError(err));
    } finally {
      setLoading(false);
    }
  };

  const ERROR_ICONS = { conflict: '⚠️', validation: '📋', server: '🔧', error: '❌' };

  return (
    <div className="booking-form-page">
      <a href="#back" onClick={e => { e.preventDefault(); navigate(-1); }} className="back-link">
        ← Back
      </a>

      <h1>New Booking</h1>
      <p className="form-subtitle">Fill in the details below to reserve a campus resource</p>

      {urlResourceName && (
        <div className="resource-banner">
          <span className="resource-banner-icon">🏢</span>
          <div>
            <div className="resource-banner-name">{urlResourceName}</div>
            <div className="resource-banner-id">Resource ID: {urlResourceId}</div>
          </div>
        </div>
      )}

      {error && (
        <div className={`form-error-box ${error.type}`}>
          <div className="err-icon-wrap">
            <span className="err-icon">{ERROR_ICONS[error.type] || '❌'}</span>
          </div>
          <div className="err-body">
            <p className="err-title">{error.title}</p>
            <p className="err-detail">{error.detail}</p>
            {error.tips?.length > 0 && (
              <ul className="err-tips">
                {error.tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="form-card">
        <div className="form-card-header">
          <div className="form-card-header-icon">📅</div>
          <div>
            <h2>Booking Details</h2>
            <p>All fields marked are required</p>
          </div>
        </div>

        <div className="form-card-body">
          <form onSubmit={handleSubmit} className="form-spacer">

            <div className="form-section-divider"><span>User &amp; Resource</span></div>
            <div className="form-grid-2">
              <Field label="User ID"     icon="👤" name="userId"     type="number" value={form.userId}     onChange={handleChange} locked={!!(urlUserId || user?.id)} />
              <Field label="Resource ID" icon="🏢" name="resourceId" type="number" value={form.resourceId} onChange={handleChange} locked={!!urlResourceId} />
            </div>
            <Field label="Email Address" icon="📧" name="userEmail" type="email" value={form.userEmail} onChange={handleChange} locked={!!(urlUserEmail || user?.email)} />

            <div className="form-section-divider"><span>Date &amp; Time</span></div>
            <Field label="Booking Date" name="bookingDate" type="date" value={form.bookingDate} onChange={handleChange} />
            <div className="form-grid-2">
              <Field label="Start Time" name="startTime" type="time" value={form.startTime} onChange={handleChange} />
              <Field label="End Time"   name="endTime"   type="time" value={form.endTime}   onChange={handleChange} />
            </div>

            <div className="form-section-divider"><span>Details</span></div>
            <Field label="Purpose"             name="purpose"   value={form.purpose}   onChange={handleChange} />
            <Field label="Number of Attendees" name="attendees" type="number" value={form.attendees} onChange={handleChange} />

            <button type="submit" disabled={loading} className="form-submit-btn">
              {loading ? '⏳ Submitting...' : 'Submit Booking Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
