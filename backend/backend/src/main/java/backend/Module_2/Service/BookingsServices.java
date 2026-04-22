package backend.Module_2.Service;

import backend.Module_2.Enums.BookingsStatus;
import backend.Module_2.dto.BookingsRequest;
import backend.Module_2.dto.BookingsResponse;

import java.util.List;

public interface BookingsServices {

    BookingsResponse createBooking(BookingsRequest request);
    BookingsResponse getBookingById(Long id);
    List<BookingsResponse> getBookingByUser(Long userId);
    List<BookingsResponse> getAllBookings();
    List<BookingsResponse> getAllBookingsByStatus(BookingsStatus status);
    BookingsResponse approveBooking(Long id);
    BookingsResponse rejectBooking(Long id, String reason);
    BookingsResponse cancelBooking(Long id);
    void deleteBooking(Long id);
}
