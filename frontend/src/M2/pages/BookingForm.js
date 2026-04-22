import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../api/bookingApi';

const initialState = {
  userId: '', resourceId: '', bookingDate: '',
  startTime: '', endTime: '', userEmail: '', purpose: '', attendees: '',
};

function Field({ label, name, type = 'text', value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
    </div>
  );
}

function BookingForm() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const parseError = (msg) => {
    try {
      const parsed = JSON.parse(msg);
      return parsed.error || msg;
    } catch {
      return msg;
    }
  };

  const isConflict = (msg) => msg?.toLowerCase().includes('conflict');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createBooking({
        ...form,
        userId: Number(form.userId),
        resourceId: Number(form.resourceId),
        attendees: Number(form.attendees),
      });
      navigate('/my-bookings');
    } catch (err) {
      setError(parseError(err.message) || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">New Booking</h1>
      <p className="text-gray-500 mb-8">Fill in the details to request a campus resource.</p>

      {error && (
        <div className={`rounded-xl px-5 py-4 mb-6 flex gap-3 items-start ${
          isConflict(error)
            ? 'bg-orange-50 border border-orange-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <span className="text-2xl mt-0.5">{isConflict(error) ? '⚠️' : '❌'}</span>
          <div>
            <p className={`font-semibold text-sm ${isConflict(error) ? 'text-orange-700' : 'text-red-700'}`}>
              {isConflict(error) ? 'Time Slot Already Booked' : 'Booking Failed'}
            </p>
            <p className={`text-sm mt-1 ${isConflict(error) ? 'text-orange-600' : 'text-red-600'}`}>
              {isConflict(error)
                ? `Resource ${form.resourceId} is already booked on ${form.bookingDate} from ${form.startTime} to ${form.endTime}. Please choose a different time slot or resource.`
                : error}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="User ID" name="userId" type="number" value={form.userId} onChange={handleChange} />
          <Field label="Resource ID" name="resourceId" type="number" value={form.resourceId} onChange={handleChange} />
        </div>
        <Field label="Email" name="userEmail" type="email" value={form.userEmail} onChange={handleChange} />
        <Field label="Booking Date" name="bookingDate" type="date" value={form.bookingDate} onChange={handleChange} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Start Time" name="startTime" type="time" value={form.startTime} onChange={handleChange} />
          <Field label="End Time" name="endTime" type="time" value={form.endTime} onChange={handleChange} />
        </div>
        <Field label="Purpose" name="purpose" value={form.purpose} onChange={handleChange} />
        <Field label="Number of Attendees" name="attendees" type="number" value={form.attendees} onChange={handleChange} />

        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Booking Request'}
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
