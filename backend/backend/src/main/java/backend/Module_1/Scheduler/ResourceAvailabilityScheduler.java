package backend.Module_1.Scheduler;

import backend.Module_1.Enums.ResourceStatus;
import backend.Module_1.Model.Resource;
import backend.Module_1.Repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ResourceAvailabilityScheduler {

    private static final Logger logger = LoggerFactory.getLogger(ResourceAvailabilityScheduler.class);

    private final ResourceRepository resourceRepository;

    @Scheduled(fixedRate = 120000)
    public void restoreResourcesAutomatically() {
        List<Resource> expiredResources = resourceRepository.findByStatusAndOutOfServiceUntilBefore(
                ResourceStatus.OUT_OF_SERVICE,
                LocalDateTime.now()
        );

        if (expiredResources.isEmpty()) {
            logger.info("Scheduler checked resources: no expired OUT_OF_SERVICE resources found.");
            return;
        }

        for (Resource resource : expiredResources) {
            resource.setStatus(ResourceStatus.ACTIVE);
            resource.setOutOfServiceUntil(null);
        }

        resourceRepository.saveAll(expiredResources);
        logger.info("Scheduler auto-restored {} resource(s) to ACTIVE status.", expiredResources.size());
    }
}