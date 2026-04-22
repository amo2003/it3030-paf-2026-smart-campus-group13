package backend.Module_2.dto;

import backend.Module_2.Enums.BookingsStatus;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingsResponse {

    private Long id;
    private Long userId;
    private Long resourceId;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String userEmail;
    private String purpose;
    private Integer attendees;
    private BookingsStatus status;
    private String rejectionReason;

    public BookingsResponse() {}

    public BookingsResponse(Long id, Long userId, Long resourceId, LocalDate bookingDate,
                            LocalTime startTime, LocalTime endTime, String userEmail, String purpose,
                            Integer attendees, BookingsStatus status, String rejectionReason) {
        this.id = id;
        this.userId = userId;
        this.resourceId = resourceId;
        this.bookingDate = bookingDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.userEmail = userEmail;
        this.purpose = purpose;
        this.attendees = attendees;
        this.status = status;
        this.rejectionReason = rejectionReason;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getResourceId() { return resourceId; }
    public void setResourceId(Long resourceId) { this.resourceId = resourceId; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public Integer getAttendees() { return attendees; }
    public void setAttendees(Integer attendees) { this.attendees = attendees; }

    public BookingsStatus getStatus() { return status; }
    public void setStatus(BookingsStatus status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
