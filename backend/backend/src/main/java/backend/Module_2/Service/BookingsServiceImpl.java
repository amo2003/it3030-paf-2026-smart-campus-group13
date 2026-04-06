package backend.Module_2.Service;

import backend.Module_2.Enums.BookingStatus;
import backend.Module_2.Model.Bookings;
import backend.Module_2.Repository.BookingsRepository;
import backend.Module_2.dto.BookingsRequest;
import backend.Module_2.dto.BookingsResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingsServiceImpl implements BookingService {

    private final BookingsRepository bookingRepository;
    private final EmailsService emailService;

    public BookingsServiceImpl(BookingsRepository bookingRepository, EmailsService emailService) {
        this.bookingRepository = bookingRepository;
        this.emailService = emailService;
    }

    private BookingsResponse toReponse(Bookings booking) {
        return new BookingsResponse(
                booking.getId(),
                booking.getUserId(),
                booking.getResourceId(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getUserEmail(),
                booking.getPurpose(),
                booking.getAttendees(),
                booking.getStatus(),
                booking.getRejectionReason()
        );
    }

    @Override
    public BookingsResponse createBooking(BookingsRequest request) {
        List<Bookings> conflicts = bookingRepository.findConflictingBookings(
                request.getResourceId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime()
        );
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Booking conflict: resource already booked for this time slot");
        }

        Bookings booking = new Bookings(
                request.getUserId(),
                request.getResourceId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime(),
                request.getUserEmail(),
                request.getPurpose(),
                request.getAttendees(),
                BookingStatus.PENDING
        );

        BookingsResponse response = toReponse(bookingRepository.save(booking));

        emailService.sendEmail(
            request.getUserEmail(),
            "Booking Request Received — Smart Campus",
            "Dear User,\n\n" +
            "Your booking request has been received and is awaiting admin approval.\n\n" +
            "Booking Details:\n" +
            "Resource ID : " + request.getResourceId() + "\n" +
            "Date        : " + request.getBookingDate() + "\n" +
            "Time        : " + request.getStartTime() + " - " + request.getEndTime() + "\n" +
            "Purpose     : " + request.getPurpose() + "\n\n" +
            "We will notify you once your booking is reviewed.\n\n" +
            "Smart Campus Operations Hub"
        );

        return response;
    }

    @Override
    public BookingsResponse getBookingById(Long id) {
        Bookings booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        return toReponse(booking);
    }

    @Override
    public List<BookingsResponse> getBookingByUser(Long userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(this::toReponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingsResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::toReponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingsResponse> getAllBookingsByStatus(BookingsStatus status) {
        return bookingRepository.findByStatus(status)
                .stream()
                .map(this::toReponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponse approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be approved");
        }
        booking.setStatus(BookingStatus.APPROVED);
        BookingsResponse response = toReponse(bookingRepository.save(booking));

        emailService.sendEmail(
            booking.getUserEmail(),
            "Booking Approved — Smart Campus",
            "Dear User,\n\n" +
            "Great news! Your booking has been APPROVED.\n\n" +
            "Booking Details:\n" +
            "Resource ID : " + booking.getResourceId() + "\n" +
            "Date        : " + booking.getBookingDate() + "\n" +
            "Time        : " + booking.getStartTime() + " - " + booking.getEndTime() + "\n" +
            "Purpose     : " + booking.getPurpose() + "\n\n" +
            "Please arrive on time. You may cancel if plans change.\n\n" +
            "Smart Campus Operations Hub"
        );

        return response;
    }

    @Override
    public BookingsResponse rejectBooking(Long id, String reason) {
        Bookings booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        if (booking.getStatus() != BookingsStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be rejected");
        }
        booking.setStatus(BookingsStatus.REJECTED);
        booking.setRejectionReason(reason);
        BookingsResponse response = toReponse(bookingRepository.save(booking));

        emailService.sendEmail(
            booking.getUserEmail(),
            "Booking Rejected — Smart Campus",
            "Dear User,\n\n" +
            "Unfortunately your booking request has been REJECTED.\n\n" +
            "Booking Details:\n" +
            "Resource ID     : " + booking.getResourceId() + "\n" +
            "Date            : " + booking.getBookingDate() + "\n" +
            "Time            : " + booking.getStartTime() + " - " + booking.getEndTime() + "\n" +
            "Rejection Reason: " + reason + "\n\n" +
            "You may submit a new booking with a different time or resource.\n\n" +
            "Smart Campus Operations Hub"
        );

        return response;
    }

    @Override
    public BookingsResponse cancelBooking(Long id) {
        Bookings booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        if (booking.getStatus() != BookingsStatus.APPROVED) {
            throw new RuntimeException("Only approved bookings can be cancelled");
        }
        booking.setStatus(BookingsStatus.CANCELLED);
        return toReponse(bookingRepository.save(booking));
    }

    @Override
    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found with id: " + id);
        }
        bookingRepository.deleteById(id);
    }
}
