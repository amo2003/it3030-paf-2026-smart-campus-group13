package backend.Module_1.DTO;

import backend.Module_1.Enums.ResourceStatus;
import backend.Module_1.Enums.ResourceType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@Builder
public class ResourceResponse {

    private Long id;
    private String resourceCode;
    private String name;
    private ResourceType type;
    private Integer capacity;
    private String location;
    private LocalTime availableFrom;
    private LocalTime availableTo;
    private ResourceStatus status;
    private String description;
    private LocalDateTime outOfServiceUntil;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}