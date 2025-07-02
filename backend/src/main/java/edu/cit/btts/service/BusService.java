package edu.cit.btts.service;

import edu.cit.btts.dto.BusDTO;
import edu.cit.btts.model.Bus;
import edu.cit.btts.repository.BusRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service // Mark this class as a Spring Service component
public class BusService {

    private final BusRepository busRepository;

    // Constructor Injection for BusRepository
    public BusService(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    /**
     * Creates a new Bus record.
     *
     * @param busDTO The Bus data from the request.
     * @return The created BusDTO.
     * @throws ResponseStatusException if a bus with the same plate number already exists.
     */
    public BusDTO createBus(BusDTO busDTO) {
        // Business logic: Check for existing plate number to prevent duplicates
        if (busRepository.findByPlateNumber(busDTO.getPlateNumber()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Bus with plate number '" + busDTO.getPlateNumber() + "' already exists.");
        }

        Bus bus = new Bus();
        mapDtoToEntity(busDTO, bus); // Map DTO fields to the new Bus entity

        Bus savedBus = busRepository.save(bus); // Save to database
        return mapEntityToDto(savedBus); // Map saved entity back to DTO for response
    }

    /**
     * Retrieves all Bus records.
     *
     * @return A list of all BusDTOs.
     */
    public List<BusDTO> getAllBuses() {
        List<Bus> buses = busRepository.findAll();
        return buses.stream()
                .map(this::mapEntityToDto) // Map each Bus entity to a BusDTO
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a single Bus record by its ID.
     *
     * @param id The ID of the bus.
     * @return The BusDTO if found.
     * @throws ResponseStatusException if the bus is not found.
     */
    public BusDTO getBusById(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Bus not found with ID: " + id));
        return mapEntityToDto(bus);
    }

    /**
     * Updates an existing Bus record.
     *
     * @param id The ID of the bus to update.
     * @param busDTO The updated Bus data.
     * @return The updated BusDTO.
     * @throws ResponseStatusException if the bus is not found or if the new plate number conflicts with another bus.
     */
    public BusDTO updateBus(Long id, BusDTO busDTO) {
        Bus existingBus = busRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Bus not found with ID: " + id));

        // Business logic: Check for plate number conflict if it's being changed
        if (!existingBus.getPlateNumber().equals(busDTO.getPlateNumber())) {
            Optional<Bus> busWithSamePlate = busRepository.findByPlateNumber(busDTO.getPlateNumber());
            if (busWithSamePlate.isPresent() && !busWithSamePlate.get().getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Another bus with plate number '" + busDTO.getPlateNumber() + "' already exists.");
            }
        }

        mapDtoToEntity(busDTO, existingBus); // Map updated DTO fields to the existing entity

        Bus updatedBus = busRepository.save(existingBus); // Save changes
        return mapEntityToDto(updatedBus); // Map updated entity back to DTO
    }

    /**
     * Deletes a Bus record by its ID.
     *
     * @param id The ID of the bus to delete.
     * @throws ResponseStatusException if the bus is not found.
     */
    public void deleteBus(Long id) {
        if (!busRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Bus not found with ID: " + id);
        }
        busRepository.deleteById(id);
    }

    // --- Helper Methods for DTO <-> Entity Mapping (private to the service) ---

    // Converts a Bus entity to a BusDTO
    private BusDTO mapEntityToDto(Bus bus) {
        if (bus == null) return null;
        return new BusDTO(
                bus.getId(),
                bus.getPlateNumber(),
                bus.getName(),
                bus.getOperator(),
                bus.getRowCount(),
                bus.getColumnCount(),
                bus.getRowLabel(),
                bus.getColumnLabel()
        );
    }

    // Maps fields from a BusDTO to a Bus entity
    private void mapDtoToEntity(BusDTO busDTO, Bus bus) {
        // ID is not mapped from DTO to entity here as it's typically set by JPA or path variable
        bus.setPlateNumber(busDTO.getPlateNumber());
        bus.setName(busDTO.getName());
        bus.setOperator(busDTO.getOperator());
        bus.setRowCount(busDTO.getRowCount());
        bus.setColumnCount(busDTO.getColumnCount());
        bus.setRowLabel(busDTO.getRowLabel());
        bus.setColumnLabel(busDTO.getColumnLabel());
    }
}