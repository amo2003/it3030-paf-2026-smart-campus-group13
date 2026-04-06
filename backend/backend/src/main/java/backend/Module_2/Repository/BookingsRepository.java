package backend.Module_2.Repository;

import backend.Module_2.Enums.BookingsStatus;
import backend.Module_2.Model.Bookings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingsRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByStatus(BookingsStatus status);

    List<Booking> findByResourceId(Long resourceId);

    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resourceId " +
            "AND b.bookingDate = :bookingDate " +
            "AND b.status = 'APPROVED' " +
            "AND b.startTime < :endTime " +
            "AND b.endTime > :startTime")
    List<Booking> findConflictingBookings(
            @Param("resourceId") Long resourceId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );
}
