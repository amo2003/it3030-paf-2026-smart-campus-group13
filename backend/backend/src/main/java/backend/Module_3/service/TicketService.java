package backend.Module_3.service;

import backend.Module_3.dto.AssignTechnicianRequest;
import backend.Module_3.dto.CommentRequest;
import backend.Module_3.dto.RejectTicketRequest;
import backend.Module_3.dto.ResolveTicketRequest;
import backend.Module_3.model.Attachment;
import backend.Module_3.model.Comment;
import backend.Module_3.model.Ticket;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TicketService {
    Ticket createTicket(Ticket ticket);
    List<Ticket> getAllTickets();
    Ticket getTicketById(Long id);
    Ticket updateStatus(Long id, String status);

    Comment addComment(Long ticketId, CommentRequest request);
    List<Comment> getCommentsByTicketId(Long ticketId);

    Attachment uploadAttachment(Long ticketId, MultipartFile file);

    Ticket assignTechnician(Long ticketId, AssignTechnicianRequest request);
    Ticket rejectTicket(Long ticketId, RejectTicketRequest request);
    Ticket resolveTicket(Long ticketId, ResolveTicketRequest request);
}