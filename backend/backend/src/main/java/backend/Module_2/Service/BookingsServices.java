package backend.Module_2.Service;

import backend.Module_2.Enums.BookingStatus;
import backend.Module_2.dto.BookingRequest;
import backend.Module_2.dto.BookingResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(BookingRequest request);
    BookingResponse getBookingById(Long id);
    List<BookingResponse> getBookingByUser(Long userId);
    List<BookingResponse> getAllBookings();
    List<BookingResponse> getAllBookingsByStatus(BookingStatus status);
    BookingResponse approveBooking(Long id);
    BookingResponse rejectBooking(Long id, String reason);
    BookingResponse cancelBooking(Long id);
    void deleteBooking(Long id);
}
