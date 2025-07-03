package edu.cit.btts.dto;

import edu.cit.btts.model.SeatStatus;

public class SeatDTO {
  private Long id;
  private Integer rowPosition;
  private Integer columnPosition;
  private SeatStatus status;
  private Long tripId; // Associated trip ID

  public SeatDTO() {}

  public SeatDTO(Long id, Integer rowPosition, Integer columnPosition, SeatStatus status, Long tripId) {
    this.id = id;
    this.rowPosition = rowPosition;
    this.columnPosition = columnPosition;
    this.status = status;
    this.tripId = tripId;
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Integer getRowPosition() { return rowPosition; }
  public void setRowPosition(Integer rowPosition) { this.rowPosition = rowPosition; }
  public Integer getColumnPosition() { return columnPosition; }
  public void setColumnPosition(Integer columnPosition) { this.columnPosition = columnPosition; }
  public SeatStatus getStatus() { return status; }
  public void setStatus(SeatStatus status) { this.status = status; }
  public Long getTripId() { return tripId; }
  public void setTripId(Long tripId) { this.tripId = tripId; }
}