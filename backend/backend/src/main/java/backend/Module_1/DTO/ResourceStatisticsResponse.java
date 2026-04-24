package backend.Module_1.DTO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ResourceStatisticsResponse {

    private long totalResources;
    private long activeResources;
    private long outOfServiceResources;
    private long underMaintenanceResources;

    private long lectureHallCount;
    private long labCount;
    private long meetingRoomCount;
    private long equipmentCount;

    private long totalCapacity;
}