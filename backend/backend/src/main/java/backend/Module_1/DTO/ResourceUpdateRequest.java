package backend.Module_1.DTO;

import backend.Module_1.Enums.ResourceStatus;
import backend.Module_1.Enums.ResourceType;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
public class ResourceUpdateRequest {

    private String resourceCode;
    private String name;
    private ResourceType type;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    private String location;
    private LocalTime availableFrom;
    private LocalTime availableTo;
    private ResourceStatus status;
    private String description;
    private LocalDateTime outOfServiceUntil;
}