import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ticketService from "../services/ticketService";

function TicketDetailsPage() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentData, setCommentData] = useState({
    userName: "",
    message: "",
  });
  const [technicianName, setTechnicianName] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTicket();
    fetchComments();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await ticketService.getTicketById(id);
      setTicket(response.data);
    } catch (err) {
      setError("Failed to load ticket");
    }
  };

  const fetchComments = async () => {
    try {
      const response = await ticketService.getComments(id);
      setComments(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentChange = (e) => {
    setCommentData({
      ...commentData,
      [e.target.name]: e.target.value,
    });
  };

  const submitComment = async () => {
    try {
      await ticketService.addComment(id, commentData);
      setCommentData({ userName: "", message: "" });
      fetchComments();
    } catch (err) {
      setError("Failed to add comment");
    }
  };

  const changeStatus = async (status) => {
    try {
      await ticketService.updateStatus(id, status);
      fetchTicket();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to update status"
      );
    }
  };

  const assignTechnicianAction = async () => {
    try {
      await ticketService.assignTechnician(id, { technicianName });
      setTechnicianName("");
      fetchTicket();
    } catch (err) {
      setError("Failed to assign technician");
    }
  };

  const rejectTicketAction = async () => {
    try {
      await ticketService.rejectTicket(id, { reason: rejectReason });
      setRejectReason("");
      fetchTicket();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to reject ticket"
      );
    }
  };

  const resolveTicketAction = async () => {
    try {
      await ticketService.resolveTicket(id, { resolutionNotes });
      setResolutionNotes("");
      fetchTicket();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to resolve ticket"
      );
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await ticketService.uploadAttachment(id, formData);
      setUploadedFiles((prev) => [...prev, response.data]);
      setSelectedFile(null);
      fetchTicket();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to upload attachment"
      );
    }
  };

  if (!ticket) {
    return <div className="page-container">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>{ticket.title}</h1>
          <p className="subtext">Ticket details and actions</p>
        </div>
        <span className={`badge badge-${ticket.status?.toLowerCase()}`}>
          {ticket.status}
        </span>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="details-grid">
        <div className="details-box">
          <h3>Ticket Information</h3>
          <p><strong>Description:</strong> {ticket.description}</p>
          <p><strong>Priority:</strong> {ticket.priority}</p>
          <p><strong>Category:</strong> {ticket.category}</p>
          <p><strong>Preferred Contact:</strong> {ticket.preferredContact}</p>
          <p><strong>Location:</strong> {ticket.resourceLocation}</p>
          <p><strong>Created By:</strong> {ticket.createdBy}</p>
          <p><strong>Assigned Technician:</strong> {ticket.assignedTechnician || "Not Assigned"}</p>
          <p><strong>Resolution Notes:</strong> {ticket.resolutionNotes || "-"}</p>
          <p><strong>Rejection Reason:</strong> {ticket.rejectionReason || "-"}</p>
        </div>

        <div className="details-box">
          <h3>Quick Actions</h3>
          <div className="button-group">
            <button onClick={() => changeStatus("IN_PROGRESS")}>Mark IN_PROGRESS</button>
            <button onClick={() => changeStatus("CLOSED")}>Mark CLOSED</button>
          </div>

          <label>Assign Technician</label>
          <input
            type="text"
            placeholder="Technician Name"
            value={technicianName}
            onChange={(e) => setTechnicianName(e.target.value)}
          />
          <button onClick={assignTechnicianAction}>Assign</button>

          <label>Resolution Notes</label>
          <textarea
            placeholder="Resolution Notes"
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
          />
          <button onClick={resolveTicketAction}>Resolve Ticket</button>

          <label>Reject Reason</label>
          <textarea
            placeholder="Reject Reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <button className="danger-btn" onClick={rejectTicketAction}>Reject Ticket</button>
        </div>
      </div>

      <div className="action-box">
        <h3>Attachment Upload</h3>
        <div className="upload-row">
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <button onClick={uploadFile}>Upload</button>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="attachment-preview-grid">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="attachment-card">
                <p>{file.fileName}</p>
                <small>{file.filePath}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="action-box">
        <h3>Add Comment</h3>
        <input
          type="text"
          name="userName"
          placeholder="Your Name"
          value={commentData.userName}
          onChange={handleCommentChange}
        />
        <textarea
          name="message"
          placeholder="Comment"
          value={commentData.message}
          onChange={handleCommentChange}
        />
        <button onClick={submitComment}>Add Comment</button>
      </div>

      <div className="action-box">
        <h3>Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <p><strong>{comment.userName}</strong></p>
              <p>{comment.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TicketDetailsPage;