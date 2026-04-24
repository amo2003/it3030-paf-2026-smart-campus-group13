package backend.Module_3.repository;

import backend.Module_3.model.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
   List<Attachment> findByTicketId(Long ticketId);

    long countByTicketId(Long ticketId);
}