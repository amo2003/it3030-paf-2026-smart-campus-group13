package backend.Module_3.controller;

import backend.Module_3.dto.AssignTechnicianRequest;
import backend.Module_3.dto.CommentRequest;
import backend.Module_3.dto.RejectTicketRequest;
import backend.Module_3.dto.ResolveTicketRequest;
import backend.Module_3.model.Attachment;
import backend.Module_3.model.Comment;
import backend.Module_3.model.Ticket;
import backend.Module_3.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:3000")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public Ticket createTicket(@Valid @RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/{id}")
    public Ticket getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id);
    }

    @PutMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ticketService.updateStatus(id, status);
    }

    @PostMapping("/{id}/comments")
    public Comment addComment(@PathVariable Long id, @Valid @RequestBody CommentRequest request) {
        return ticketService.addComment(id, request);
    }

    @GetMapping("/{id}/comments")
    public List<Comment> getComments(@PathVariable Long id) {
        return ticketService.getCommentsByTicketId(id);
    }

    @PostMapping("/{id}/attachments")
    public Attachment uploadAttachment(@PathVariable Long id,
                                       @RequestParam("file") MultipartFile file) {
        return ticketService.uploadAttachment(id, file);
    }

    @PutMapping("/{id}/assign")
    public Ticket assignTechnician(@PathVariable Long id,
                                   @Valid @RequestBody AssignTechnicianRequest request) {
        return ticketService.assignTechnician(id, request);
    }

    @PutMapping("/{id}/reject")
    public Ticket rejectTicket(@PathVariable Long id,
                               @Valid @RequestBody RejectTicketRequest request) {
        return ticketService.rejectTicket(id, request);
    }

    @PutMapping("/{id}/resolve")
    public Ticket resolveTicket(@PathVariable Long id,
                                @Valid @RequestBody ResolveTicketRequest request) {
        return ticketService.resolveTicket(id, request);
    }
}