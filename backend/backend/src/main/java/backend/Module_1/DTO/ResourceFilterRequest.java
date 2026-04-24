package backend.Module_1.DTO;

import backend.Module_1.Enums.ResourceStatus;
import backend.Module_1.Enums.ResourceType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResourceFilterRequest {

    private String keyword;
    private ResourceType type;
    private Integer minCapacity;
    private String location;
    private ResourceStatus status;
}