package backend.Module_3.service.impl;

import backend.Module_3.dto.AssignTechnicianRequest;
import backend.Module_3.dto.CommentRequest;
import backend.Module_3.dto.RejectTicketRequest;
import backend.Module_3.dto.ResolveTicketRequest;
import backend.Module_3.enums.TicketStatus;
import backend.Module_3.model.Attachment;
import backend.Module_3.model.Comment;
import backend.Module_3.model.Ticket;
import backend.Module_3.repository.AttachmentRepository;
import backend.Module_3.repository.CommentRepository;
import backend.Module_3.repository.TicketRepository;
import backend.Module_3.service.TicketService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final AttachmentRepository attachmentRepository;

    public TicketServiceImpl(TicketRepository ticketRepository,
                             CommentRepository commentRepository,
                             AttachmentRepository attachmentRepository) {
        this.ticketRepository = ticketRepository;
        this.commentRepository = commentRepository;
        this.attachmentRepository = attachmentRepository;
    }

    @Override
    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    @Override
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Override
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with id: " + id));
    }

    @Override
    public Ticket updateStatus(Long id, String status) {
        Ticket ticket = getTicketById(id);
        TicketStatus newStatus = TicketStatus.valueOf(status.toUpperCase());

        if (!isValidTransition(ticket.getStatus(), newStatus)) {
            throw new IllegalArgumentException(
                    "Invalid status transition from " + ticket.getStatus() + " to " + newStatus
            );
        }

        ticket.setStatus(newStatus);
        return ticketRepository.save(ticket);
    }

    @Override
    public Comment addComment(Long ticketId, CommentRequest request) {
        Ticket ticket = getTicketById(ticketId);

        Comment comment = new Comment();
        comment.setTicketId(ticket.getId());
        comment.setUserName(request.getUserName());
        comment.setMessage(request.getMessage());

        return commentRepository.save(comment);
    }

    @Override
    public List<Comment> getCommentsByTicketId(Long ticketId) {
        getTicketById(ticketId);
        return commentRepository.findByTicketId(ticketId);
    }

    @Override
    public Attachment uploadAttachment(Long ticketId, MultipartFile file) {
        getTicketById(ticketId);

        if (attachmentRepository.countByTicketId(ticketId) >= 3) {
            throw new RuntimeException("Max 3 attachments allowed");
        }

        try {
            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
            File dir = new File(uploadDir);

            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalFileName = file.getOriginalFilename();
            String fileName = System.currentTimeMillis() + "_" + originalFileName;
            String filePath = uploadDir + File.separator + fileName;

            file.transferTo(new File(filePath));

            Attachment attachment = new Attachment();
            attachment.setTicketId(ticketId);
            attachment.setFileName(fileName);
            attachment.setFilePath(filePath);

            return attachmentRepository.save(attachment);

        } catch (IOException e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    @Override
    public Ticket assignTechnician(Long ticketId, AssignTechnicianRequest request) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setAssignedTechnician(request.getTechnicianName());
        return ticketRepository.save(ticket);
    }

    @Override
    public Ticket rejectTicket(Long ticketId, RejectTicketRequest request) {
        Ticket ticket = getTicketById(ticketId);

        if (!(ticket.getStatus() == TicketStatus.OPEN || ticket.getStatus() == TicketStatus.IN_PROGRESS)) {
            throw new IllegalArgumentException("Only OPEN or IN_PROGRESS tickets can be rejected");
        }

        ticket.setStatus(TicketStatus.REJECTED);
        ticket.setRejectionReason(request.getReason());

        return ticketRepository.save(ticket);
    }

    @Override
    public Ticket resolveTicket(Long ticketId, ResolveTicketRequest request) {
        Ticket ticket = getTicketById(ticketId);

        if (ticket.getStatus() != TicketStatus.IN_PROGRESS) {
            throw new IllegalArgumentException("Only IN_PROGRESS tickets can be resolved");
        }

        ticket.setResolutionNotes(request.getResolutionNotes());
        ticket.setStatus(TicketStatus.RESOLVED);

        return ticketRepository.save(ticket);
    }

    private boolean isValidTransition(TicketStatus current, TicketStatus next) {
        return switch (current) {
            case OPEN -> next == TicketStatus.IN_PROGRESS || next == TicketStatus.REJECTED;
            case IN_PROGRESS -> next == TicketStatus.RESOLVED || next == TicketStatus.REJECTED;
            case RESOLVED -> next == TicketStatus.CLOSED;
            default -> false;
        };
    }
}