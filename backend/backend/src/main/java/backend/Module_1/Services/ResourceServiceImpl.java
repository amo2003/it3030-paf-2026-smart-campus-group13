package backend.Module_1.Services;

import backend.Module_1.DTO.ResourceCreateRequest;
import backend.Module_1.DTO.ResourceFilterRequest;
import backend.Module_1.DTO.ResourceResponse;
import backend.Module_1.DTO.ResourceStatisticsResponse;
import backend.Module_1.DTO.ResourceUpdateRequest;
import backend.Module_1.Enums.ResourceStatus;
import backend.Module_1.Enums.ResourceType;
import backend.Module_1.Exception.ResourceNotFoundException;
import backend.Module_1.Model.Resource;
import backend.Module_1.Repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    @Override
    public ResourceResponse createResource(ResourceCreateRequest request) {
        validateCreateRequest(request);

        if (resourceRepository.existsByResourceCodeIgnoreCase(request.getResourceCode())) {
            throw new IllegalArgumentException("Resource code already exists");
        }

        Resource resource = Resource.builder()
                .resourceCode(request.getResourceCode().trim())
                .name(request.getName().trim())
                .type(request.getType())
                .capacity(request.getCapacity())
                .location(request.getLocation().trim())
                .availableFrom(request.getAvailableFrom())
                .availableTo(request.getAvailableTo())
                .status(request.getStatus())
                .description(request.getDescription())
                .outOfServiceUntil(request.getOutOfServiceUntil())
                .build();

        return mapToResponse(resourceRepository.save(resource));
    }

    @Override
    public List<ResourceResponse> getAllResources() {
        return resourceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ResourceResponse getResourceById(Long id) {
        Resource resource = findResourceById(id);
        return mapToResponse(resource);
    }

    @Override
    public ResourceResponse updateResource(Long id, ResourceUpdateRequest request) {
        Resource resource = findResourceById(id);

        if (request.getResourceCode() != null && !request.getResourceCode().isBlank()) {
            if (resourceRepository.existsByResourceCodeIgnoreCaseAndIdNot(request.getResourceCode(), id)) {
                throw new IllegalArgumentException("Resource code already exists");
            }
            resource.setResourceCode(request.getResourceCode().trim());
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            resource.setName(request.getName().trim());
        }

        if (request.getType() != null) {
            resource.setType(request.getType());
        }

        if (request.getCapacity() != null) {
            resource.setCapacity(request.getCapacity());
        }

        if (request.getLocation() != null && !request.getLocation().isBlank()) {
            resource.setLocation(request.getLocation().trim());
        }

        if (request.getAvailableFrom() != null) {
            resource.setAvailableFrom(request.getAvailableFrom());
        }

        if (request.getAvailableTo() != null) {
            resource.setAvailableTo(request.getAvailableTo());
        }

        if (request.getStatus() != null) {
            resource.setStatus(request.getStatus());
        }

        if (request.getDescription() != null) {
            resource.setDescription(request.getDescription());
        }

        if (request.getOutOfServiceUntil() != null) {
            resource.setOutOfServiceUntil(request.getOutOfServiceUntil());
        }

        validateTimeRange(resource.getAvailableFrom(), resource.getAvailableTo());

        if (resource.getStatus() != ResourceStatus.OUT_OF_SERVICE) {
            resource.setOutOfServiceUntil(null);
        }

        return mapToResponse(resourceRepository.save(resource));
    }

    @Override
    public ResourceResponse updateResourceStatus(Long id, ResourceStatus status, LocalDateTime outOfServiceUntil) {
        Resource resource = findResourceById(id);

        resource.setStatus(status);

        if (status == ResourceStatus.OUT_OF_SERVICE) {
            resource.setOutOfServiceUntil(outOfServiceUntil);
        } else {
            resource.setOutOfServiceUntil(null);
        }

        return mapToResponse(resourceRepository.save(resource));
    }

    @Override
    public void deleteResource(Long id) {
        Resource resource = findResourceById(id);
        resourceRepository.delete(resource);
    }

    @Override
    public List<ResourceResponse> searchResources(ResourceFilterRequest filterRequest) {
        return resourceRepository.searchResources(
                        normalize(filterRequest.getKeyword()),
                        filterRequest.getType(),
                        filterRequest.getMinCapacity(),
                        normalize(filterRequest.getLocation()),
                        filterRequest.getStatus()
                ).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ResourceStatisticsResponse getResourceStatistics() {
        Long totalCapacity = resourceRepository.getTotalCapacity();

        return ResourceStatisticsResponse.builder()
                .totalResources(resourceRepository.count())
                .activeResources(resourceRepository.countByStatus(ResourceStatus.ACTIVE))
                .outOfServiceResources(resourceRepository.countByStatus(ResourceStatus.OUT_OF_SERVICE))
                .underMaintenanceResources(resourceRepository.countByStatus(ResourceStatus.UNDER_MAINTENANCE))
                .lectureHallCount(resourceRepository.countByType(ResourceType.LECTURE_HALL))
                .labCount(resourceRepository.countByType(ResourceType.LAB))
                .meetingRoomCount(resourceRepository.countByType(ResourceType.MEETING_ROOM))
                .equipmentCount(resourceRepository.countByType(ResourceType.EQUIPMENT))
                .totalCapacity(totalCapacity != null ? totalCapacity : 0L)
                .build();
    }

    private Resource findResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    private void validateCreateRequest(ResourceCreateRequest request) {
        if (request.getAvailableFrom() != null && request.getAvailableTo() != null) {
            validateTimeRange(request.getAvailableFrom(), request.getAvailableTo());
        }

        if (request.getStatus() == ResourceStatus.OUT_OF_SERVICE && request.getOutOfServiceUntil() == null) {
            throw new IllegalArgumentException("outOfServiceUntil is required when status is OUT_OF_SERVICE");
        }
    }

    private void validateTimeRange(LocalTime availableFrom, LocalTime availableTo) {
        if (availableFrom != null && availableTo != null && !availableFrom.isBefore(availableTo)) {
            throw new IllegalArgumentException("availableFrom must be before availableTo");
        }
    }

    private String normalize(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }

    private ResourceResponse mapToResponse(Resource resource) {
        return ResourceResponse.builder()
                .id(resource.getId())
                .resourceCode(resource.getResourceCode())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .availableFrom(resource.getAvailableFrom())
                .availableTo(resource.getAvailableTo())
                .status(resource.getStatus())
                .description(resource.getDescription())
                .outOfServiceUntil(resource.getOutOfServiceUntil())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}