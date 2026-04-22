package backend.Module_1.Controller;

import backend.Module_1.DTO.ResourceStatisticsResponse;
import backend.Module_1.Services.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/module1/resources/statistics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResourceStatisticsController {

    private final ResourceService resourceService;

    @GetMapping
    public ResponseEntity<ResourceStatisticsResponse> getResourceStatistics() {
        return ResponseEntity.ok(resourceService.getResourceStatistics());
    }
}