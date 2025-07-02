package edu.cit.btts.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// DTO for creating/updating a Bus
public class BusDTO {

    private Long id; // Used for update operations

    @NotBlank(message = "Plate number cannot be blank.")
    @Size(max = 20, message = "Plate number cannot exceed 20 characters.")
    private String plateNumber;

    @NotBlank(message = "Bus name cannot be blank.")
    @Size(max = 100, message = "Bus name cannot exceed 100 characters.")
    private String name;

    @NotBlank(message = "Operator name cannot be blank.")
    @Size(max = 100, message = "Operator name cannot exceed 100 characters.")
    private String operator;

    @NotNull(message = "Row count is required.")
    @Min(value = 1, message = "Row count must be at least 1.")
    private Integer rowCount;

    @NotNull(message = "Column count is required.")
    @Min(value = 1, message = "Column count must be at least 1.")
    private Integer columnCount;

    @Size(max = 50, message = "Row label cannot exceed 50 characters.")
    private String rowLabel; // Optional, can be null

    @Size(max = 50, message = "Column label cannot exceed 50 characters.")
    private String columnLabel; // Optional, can be null

    // Constructors
    public BusDTO() {
    }

    public BusDTO(Long id, String plateNumber, String name, String operator, Integer rowCount, Integer columnCount, String rowLabel, String columnLabel) {
        this.id = id;
        this.plateNumber = plateNumber;
        this.name = name;
        this.operator = operator;
        this.rowCount = rowCount;
        this.columnCount = columnCount;
        this.rowLabel = rowLabel;
        this.columnLabel = columnLabel;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlateNumber() {
        return plateNumber;
    }

    public void setPlateNumber(String plateNumber) {
        this.plateNumber = plateNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public Integer getRowCount() {
        return rowCount;
    }

    public void setRowCount(Integer rowCount) {
        this.rowCount = rowCount;
    }

    public Integer getColumnCount() {
        return columnCount;
    }

    public void setColumnCount(Integer columnCount) {
        this.columnCount = columnCount;
    }

    public String getRowLabel() {
        return rowLabel;
    }

    public void setRowLabel(String rowLabel) {
        this.rowLabel = rowLabel;
    }

    public String getColumnLabel() {
        return columnLabel;
    }

    public void setColumnLabel(String columnLabel) {
        this.columnLabel = columnLabel;
    }

    @Override
    public String toString() {
        return "BusDTO{" +
                "id=" + id +
                ", plateNumber='" + plateNumber + '\'' +
                ", name='" + name + '\'' +
                ", operator='" + operator + '\'' +
                ", rowCount=" + rowCount +
                ", columnCount=" + columnCount +
                '}';
    }
}