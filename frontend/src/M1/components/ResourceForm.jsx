import React, { useEffect, useMemo, useState } from 'react';
import { validateResourceForm } from '../utils/resourceValidation';
import './ResourceForm.css';

const initial = { resourceCode:'', name:'', type:'', capacity:'', location:'', availableFrom:'', availableTo:'', status:'ACTIVE', description:'', outOfServiceUntil:'' };

function toTime(v) { return v ? v.slice(0,5) : ''; }

function ResourceForm({ selectedResource, onSubmit, onCancel, submitting }) {
  const [form, setForm]                   = useState(initial);
  const [touched, setTouched]             = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (selectedResource) {
      setForm({
        resourceCode: selectedResource.resourceCode || '',
        name: selectedResource.name || '',
        type: selectedResource.type || '',
        capacity: selectedResource.capacity ?? '',
        location: selectedResource.location || '',
        availableFrom: toTime(selectedResource.availableFrom),
        availableTo:   toTime(selectedResource.availableTo),
        status: selectedResource.status || 'ACTIVE',
        description: selectedResource.description || '',
        outOfServiceUntil: selectedResource.outOfServiceUntil ? selectedResource.outOfServiceUntil.slice(0,16) : '',
      });
    } else { setForm(initial); }
    setTouched({}); setSubmitAttempted(false);
  }, [selectedResource]);

  const errors = useMemo(() => validateResourceForm(form), [form]);
  const show = (f) => touched[f] || submitAttempted;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const v = name === 'resourceCode' ? value.toUpperCase().replace(/\s+/g,'') : value;
    const updated = { ...form, [name]: v };
    if (name === 'status' && value !== 'OUT_OF_SERVICE') updated.outOfServiceUntil = '';
    setForm(updated);
  };

  const handleBlur = (e) => setTouched(p => ({ ...p, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitAttempted(true);
    if (Object.keys(errors).length > 0) return;
    await onSubmit({
      resourceCode: form.resourceCode.trim(), name: form.name.trim(),
      type: form.type, capacity: Number(form.capacity), location: form.location.trim(),
      availableFrom: form.availableFrom || null, availableTo: form.availableTo || null,
      status: form.status, description: form.description.trim(),
      outOfServiceUntil: form.status === 'OUT_OF_SERVICE' && form.outOfServiceUntil ? form.outOfServiceUntil : null,
    });
  };

  const isEdit = !!selectedResource;

  return (
    <section className="res-form-section">
      <div className="res-form-header">
        <h2>{isEdit ? 'Update Resource' : 'Add New Resource'}</h2>
        <button type="button" className="res-form-cancel" onClick={onCancel}>Cancel</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="res-form-grid">
          {[
            { name:'resourceCode', label:'Resource Code', placeholder:'MR-101' },
            { name:'name',         label:'Resource Name', placeholder:'Conference Room 1' },
            { name:'capacity',     label:'Capacity',      placeholder:'20', type:'number' },
            { name:'location',     label:'Location',      placeholder:'Admin Block - Floor 1' },
          ].map(f => (
            <div key={f.name} className="res-form-field">
              <label>{f.label}</label>
              <input type={f.type||'text'} name={f.name} placeholder={f.placeholder}
                value={form[f.name]} onChange={handleChange} onBlur={handleBlur} />
              {show(f.name) && errors[f.name] && <span className="res-form-error">{errors[f.name]}</span>}
            </div>
          ))}
          <div className="res-form-field">
            <label>Type</label>
            <select name="type" value={form.type} onChange={handleChange} onBlur={handleBlur}>
              <option value="">Select Type</option>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
            {show('type') && errors.type && <span className="res-form-error">{errors.type}</span>}
          </div>
          <div className="res-form-field">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange} onBlur={handleBlur}>
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_SERVICE">Out Of Service</option>
              <option value="UNDER_MAINTENANCE">Under Maintenance</option>
            </select>
          </div>
          <div className="res-form-field">
            <label>Available From</label>
            <input type="time" name="availableFrom" value={form.availableFrom} onChange={handleChange} onBlur={handleBlur} />
          </div>
          <div className="res-form-field">
            <label>Available To</label>
            <input type="time" name="availableTo" value={form.availableTo} onChange={handleChange} onBlur={handleBlur} />
          </div>
          {form.status === 'OUT_OF_SERVICE' && (
            <div className="res-form-field">
              <label>Out Of Service Until</label>
              <input type="datetime-local" name="outOfServiceUntil" value={form.outOfServiceUntil} onChange={handleChange} onBlur={handleBlur} />
              {show('outOfServiceUntil') && errors.outOfServiceUntil && <span className="res-form-error">{errors.outOfServiceUntil}</span>}
            </div>
          )}
        </div>
        {submitAttempted && errors.availableTime && <p className="res-form-time-error">{errors.availableTime}</p>}
        <div className="res-form-field" style={{marginBottom:'16px'}}>
          <label>Description</label>
          <textarea name="description" placeholder="Description" rows={4} value={form.description} onChange={handleChange} onBlur={handleBlur} />
          {show('description') && errors.description && <span className="res-form-error">{errors.description}</span>}
        </div>
        <div className="res-form-actions">
          <button type="submit" className="res-form-submit" disabled={submitting}>
            {submitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Resource' : 'Create Resource')}
          </button>
          <button type="button" className="res-form-cancel" onClick={onCancel}>Clear / Cancel</button>
        </div>
      </form>
    </section>
  );
}

export default ResourceForm;
