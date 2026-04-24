package backend.Module_2.Controller;

import backend.Module_2.Enums.BookingsStatus;
import backend.Module_2.Service.BookingsServices;
import backend.Module_2.dto.BookingsRequest;
import backend.Module_2.dto.BookingsResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingsController {

    private final BookingsServices bookingService;

    public BookingsController(BookingsServices bookingService) {
        this.bookingService = bookingService;
    }

    // POST /api/bookings
    @PostMapping
    public ResponseEntity<BookingsResponse> createBooking(@Valid @RequestBody BookingsRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request));
    }

    // GET /api/bookings/{id}
    @GetMapping("/{id}")
    public ResponseEntity<BookingsResponse> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    // GET /api/bookings/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingsResponse>> getBookingsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingByUser(userId));
    }

    // GET /api/bookings  OR  GET /api/bookings?status=PENDING
    @GetMapping
    public ResponseEntity<List<BookingsResponse>> getAllBookings(
            @RequestParam(required = false) BookingsStatus status) {
        if (status != null) {
            return ResponseEntity.ok(bookingService.getAllBookingsByStatus(status));
        }
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // PUT /api/bookings/{id}/approve
    @PutMapping("/{id}/approve")
    public ResponseEntity<BookingsResponse> approveBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.approveBooking(id));
    }

    // PUT /api/bookings/{id}/reject
    @PutMapping("/{id}/reject")
    public ResponseEntity<BookingsResponse> rejectBooking(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(bookingService.rejectBooking(id, body.get("reason")));
    }

    // PUT /api/bookings/{id}/cancel
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingsResponse> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    // DELETE /api/bookings/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
