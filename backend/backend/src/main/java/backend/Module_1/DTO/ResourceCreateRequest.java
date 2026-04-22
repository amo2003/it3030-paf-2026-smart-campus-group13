package backend.Module_1.DTO;

import backend.Module_1.Enums.ResourceStatus;
import backend.Module_1.Enums.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
public class ResourceCreateRequest {

    @NotBlank(message = "Resource code is required")
    private String resourceCode;

    @NotBlank(message = "Resource name is required")
    private String name;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private LocalTime availableFrom;
    private LocalTime availableTo;

    @NotNull(message = "Status is required")
    private ResourceStatus status;

    private String description;
    private LocalDateTime outOfServiceUntil;
}