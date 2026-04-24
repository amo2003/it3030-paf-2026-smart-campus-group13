package backend.Module_3.dto;

import jakarta.validation.constraints.NotBlank;

public class RejectTicketRequest {

    @NotBlank(message = "Reject reason is required")
    private String reason;

    public RejectTicketRequest() {
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}