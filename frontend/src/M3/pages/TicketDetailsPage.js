import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ticketService from "../services/ticketService";
import "./TicketDetailsPage.css";

function TicketDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket]                   = useState(null);
  const [comments, setComments]               = useState([]);
  const [commentData, setCommentData]         = useState({ userName: "", message: "" });
  const [technicianName, setTechnicianName]   = useState("");
  const [rejectReason, setRejectReason]       = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [selectedFile, setSelectedFile]       = useState(null);
  const [uploadedFiles, setUploadedFiles]     = useState([]);
  const [error, setError]                     = useState("");
  const [loading, setLoading]                 = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadTicket(); loadComments(); }, [id]);

  const loadTicket = async () => {
    try { const r = await ticketService.getTicketById(id); setTicket(r.data); }
    catch { setError("Failed to load ticket"); }
    finally { setLoading(false); }
  };

  const loadComments = async () => {
    try { const r = await ticketService.getComments(id); setComments(r.data); } catch {}
  };

  const reload = () => { loadTicket(); loadComments(); };

  const changeStatus = async (status) => {
    setError("");
    try { await ticketService.updateStatus(id, status); reload(); }
    catch (e) { setError(e?.response?.data?.message || "Failed to update status"); }
  };

  const assignTechnicianAction = async () => {
    if (!technicianName.trim()) return;
    setError("");
    try { await ticketService.assignTechnician(id, { technicianName }); setTechnicianName(""); reload(); }
    catch { setError("Failed to assign technician"); }
  };

  const rejectTicketAction = async () => {
    if (!rejectReason.trim()) return;
    setError("");
    try { await ticketService.rejectTicket(id, { reason: rejectReason }); setRejectReason(""); reload(); }
    catch (e) { setError(e?.response?.data?.message || "Failed to reject ticket"); }
  };

  const resolveTicketAction = async () => {
    setError("");
    try { await ticketService.resolveTicket(id, { resolutionNotes }); setResolutionNotes(""); reload(); }
    catch (e) { setError(e?.response?.data?.message || "Failed to resolve ticket"); }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;
    setError("");
    const fd = new FormData();
    fd.append("file", selectedFile);
    try {
      const r = await ticketService.uploadAttachment(id, fd);
      setUploadedFiles(p => [...p, r.data]);
      setSelectedFile(null);
      loadTicket();
    } catch (e) { setError(e?.response?.data?.message || "Failed to upload"); }
  };

  const submitComment = async () => {
    if (!commentData.message.trim()) return;
    setError("");
    try { await ticketService.addComment(id, commentData); setCommentData({ userName: "", message: "" }); loadComments(); }
    catch { setError("Failed to add comment"); }
  };

  if (loading) return <div className="ticket-details-page"><p className="td-empty-msg">Loading ticket...</p></div>;
  if (!ticket) return <div className="ticket-details-page"><div className="td-error">Ticket not found.</div></div>;

  const statusKey = ticket.status ? ticket.status.toLowerCase() : "";

  return (
    <div className="ticket-details-page">

      <button className="td-back" onClick={() => navigate("/tickets")}>Back to Tickets</button>

      <div className="td-header">
        <div className="td-header-left">
          <h1>{ticket.title}</h1>
          <p>Ticket #{ticket.id}</p>
        </div>
        <div className="td-header-right">
          <span className={"td-badge " + statusKey}>{ticket.status}</span>
        </div>
      </div>

      {error && <div className="td-error">{error}</div>}

      <div className="td-grid">

        <div className="td-card">
          <div className="td-card-title">Ticket Information</div>
          <div className="td-info-list">
            <div className="td-info-row"><span className="info-label">Description</span><span className="info-value">{ticket.description || "—"}</span></div>
            <div className="td-info-row"><span className="info-label">Priority</span><span className="info-value"><span className={"priority-tag " + ticket.priority}>{ticket.priority}</span></span></div>
            <div className="td-info-row"><span className="info-label">Category</span><span className="info-value">{ticket.category}</span></div>
            <div className="td-info-row"><span className="info-label">Location</span><span className="info-value highlight">{ticket.resourceLocation || "—"}</span></div>
            <div className="td-info-row"><span className="info-label">Created By</span><span className="info-value">{ticket.createdBy || "—"}</span></div>
            <div className="td-info-row"><span className="info-label">Preferred Contact</span><span className="info-value">{ticket.preferredContact || "—"}</span></div>
            <div className="td-info-row"><span className="info-label">Assigned Technician</span><span className="info-value">{ticket.assignedTechnician || "Not Assigned"}</span></div>
            {ticket.resolutionNotes && <div className="td-info-row"><span className="info-label">Resolution Notes</span><span className="info-value">{ticket.resolutionNotes}</span></div>}
            {ticket.rejectionReason && <div className="td-info-row"><span className="info-label">Rejection Reason</span><span className="info-value" style={{color:"#ef4444"}}>{ticket.rejectionReason}</span></div>}
          </div>
        </div>

        <div className="td-card">
          <div className="td-card-title">Quick Actions</div>
          <div className="td-actions-section">

            <div className="td-action-group">
              <div className="td-action-group-label">Change Status</div>
              <div className="td-status-btns">
                <button className="td-btn blue"  onClick={() => changeStatus("IN_PROGRESS")}>In Progress</button>
                <button className="td-btn slate" onClick={() => changeStatus("CLOSED")}>Close</button>
              </div>
            </div>

            <div className="td-action-group">
              <div className="td-action-group-label">Assign Technician</div>
              <input type="text" placeholder="Technician name..." value={technicianName} onChange={e => setTechnicianName(e.target.value)} />
              <button className="td-btn green" onClick={assignTechnicianAction} disabled={!technicianName.trim()}>Assign</button>
            </div>

            <div className="td-action-group">
              <div className="td-action-group-label">Resolve Ticket</div>
              <textarea placeholder="Resolution notes..." value={resolutionNotes} onChange={e => setResolutionNotes(e.target.value)} />
              <button className="td-btn orange" onClick={resolveTicketAction}>Resolve Ticket</button>
            </div>

            <div className="td-action-group">
              <div className="td-action-group-label">Reject Ticket</div>
              <textarea placeholder="Rejection reason..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
              <button className="td-btn danger" onClick={rejectTicketAction} disabled={!rejectReason.trim()}>Reject Ticket</button>
            </div>

          </div>
        </div>
      </div>

      <div className="td-card td-full-card">
        <div className="td-card-title">Attachment Upload</div>
        <div className="td-upload-row">
          <input type="file" onChange={e => setSelectedFile(e.target.files[0])} />
          <button className="td-btn orange" onClick={uploadFile} disabled={!selectedFile}>Upload</button>
        </div>
        {uploadedFiles.length > 0 && (
          <div className="td-attachment-grid">
            {uploadedFiles.map((f, i) => (
              <div key={i} className="td-attachment-card">
                <p>{f.fileName}</p>
                <small>{f.filePath}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="td-card td-full-card">
        <div className="td-card-title">Add Comment</div>
        <div className="td-comment-form">
          <input type="text" placeholder="Your name..." value={commentData.userName} onChange={e => setCommentData({ ...commentData, userName: e.target.value })} />
          <textarea placeholder="Write your comment..." value={commentData.message} onChange={e => setCommentData({ ...commentData, message: e.target.value })} />
          <div>
            <button className="td-btn orange" onClick={submitComment} disabled={!commentData.message.trim()}>Post Comment</button>
          </div>
        </div>
      </div>

      <div className="td-card td-full-card">
        <div className="td-card-title">Comments ({comments.length})</div>
        {comments.length === 0
          ? <p className="td-empty-msg">No comments yet.</p>
          : (
            <div className="td-comment-list">
              {comments.map(c => (
                <div key={c.id} className="td-comment-card">
                  <div className="td-comment-author">{c.userName}</div>
                  <div className="td-comment-msg">{c.message}</div>
                </div>
              ))}
            </div>
          )
        }
      </div>

    </div>
  );
}

export default TicketDetailsPage;