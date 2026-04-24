package backend.Module_1.Services;

import backend.Module_1.DTO.ResourceCreateRequest;
import backend.Module_1.DTO.ResourceFilterRequest;
import backend.Module_1.DTO.ResourceResponse;
import backend.Module_1.DTO.ResourceStatisticsResponse;
import backend.Module_1.DTO.ResourceUpdateRequest;
import backend.Module_1.Enums.ResourceStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface ResourceService {

    ResourceResponse createResource(ResourceCreateRequest request);

    List<ResourceResponse> getAllResources();

    ResourceResponse getResourceById(Long id);

    ResourceResponse updateResource(Long id, ResourceUpdateRequest request);

    ResourceResponse updateResourceStatus(Long id, ResourceStatus status, LocalDateTime outOfServiceUntil);

    void deleteResource(Long id);

    List<ResourceResponse> searchResources(ResourceFilterRequest filterRequest);

    ResourceStatisticsResponse getResourceStatistics();
}