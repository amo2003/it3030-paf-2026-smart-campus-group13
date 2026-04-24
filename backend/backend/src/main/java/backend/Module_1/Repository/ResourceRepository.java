package backend.Module_1.Repository;

import backend.Module_1.Enums.ResourceStatus;
import backend.Module_1.Enums.ResourceType;
import backend.Module_1.Model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    boolean existsByResourceCodeIgnoreCase(String resourceCode);

    boolean existsByResourceCodeIgnoreCaseAndIdNot(String resourceCode, Long id);

    List<Resource> findByStatusAndOutOfServiceUntilBefore(ResourceStatus status, LocalDateTime dateTime);

    long countByStatus(ResourceStatus status);

    long countByType(ResourceType type);

    @Query("SELECT COALESCE(SUM(r.capacity), 0) FROM Resource r")
    Long getTotalCapacity();

    @Query("""
        SELECT r FROM Resource r
        WHERE (:keyword IS NULL OR
               LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
               LOWER(r.resourceCode) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:type IS NULL OR r.type = :type)
          AND (:minCapacity IS NULL OR r.capacity >= :minCapacity)
          AND (:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%')))
          AND (:status IS NULL OR r.status = :status)
        ORDER BY r.id DESC
    """)
    List<Resource> searchResources(
            @Param("keyword") String keyword,
            @Param("type") ResourceType type,
            @Param("minCapacity") Integer minCapacity,
            @Param("location") String location,
            @Param("status") ResourceStatus status
    );
}